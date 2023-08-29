const jwt = require("jsonwebtoken");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { user } = require("../models");
const { orders } = require("../models");

// console.log(process.env.SECRET);
const generateToken = (id) => {
  const token = jwt.sign({ id }, "N6e8O.SzPe1ixUc^f_hQ3", {
    expiresIn: "50m",
  });
  return token;
};
router.get("/getallUsers", async (req, res) => {
  try {
    const allUsers = await user.findAll();
    res.status(200).send(allUsers);
  } catch (error) {
    res.status(405).send(error.message);
  }
});

router.post("/register", async (req, res) => {
  const { username, password, question, answer } = req.body;
  try {
    if (!username) {
      throw new Error("Username is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    if (!question) {
      throw new Error("Recovery question is required");
    }
    if (!answer) {
      throw new Error("Recovery answer is required");
    }
    const exists = await user.findOne({ where: { username: username } });
    console.log(exists);
    if (exists) {
      throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await user.create({
      username,
      password: hash,
      question,
      answer,
      token: "",
      isAdmin: false,
      orders: [],
    });

    await newUser.save();
    res.status(200).send("User registered successfully");
  } catch (error) {
    res.status(405).send(error.message);
  }
});
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username) {
      throw new Error("Username is required");
    }
    if (!password) {
      throw new Error("Password is required");
    }
    const userExists = await user.findOne({ where: { username: username } });

    if (userExists) {
      const checkPassword = await bcrypt.compare(password, userExists.password);
      if (checkPassword) {
        const token = generateToken(userExists.id);
        res.status(200).send({ ...userExists.dataValues, token });
      } else {
        throw new Error("Password incorrect");
      }
    } else {
      throw new Error("User does not exist");
    }

    // res.status(200).send({ ...loggedInUser, token });
  } catch (error) {
    res.status(405).send(error.message);
  }
});

router.post("/password-recovery-request", async (req, res, next) => {
  const { username } = req.body;
  try {
    if (!username) {
      throw new Error("Please enter a username");
    }

    const exists = await user.findOne({ where: { username: username } });
    if (exists) {
      res
        .status(200)
        .send({ message: "User found", question: exists.question });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(405).send(error.message);
  }
});
router.post("/password-recovery-answer", async (req, res) => {
  const { answer, username } = req.body;
  try {
    if (!answer) {
      throw new Error("Please provide recovery answer");
    }
    if (!username) {
      throw new Error("Please provide username");
    }

    const exists = await user.findOne({ where: { username: username } });

    const token = generateToken(exists.dataValues.id);
    if (exists) {
      const compare = exists.answer.toUpperCase() === answer.toUpperCase();
      if (!compare) {
        throw new Error("Answer Incorrect");
      } else {
        res.status(200).send({ message: "Answer correct", token: token });
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(405).send(error.message);
  }
});
router.put("/change-password", async (req, res) => {
  const { password, username } = req.body;
  const token = req.headers.authorization;
  console.log(req.headers);

  try {
    if (!token) {
      throw new Error("Token required, please try again");
    }
    if (!username) {
      throw new Error("Username required, please try again");
    }
    if (!password) {
      throw new Error("Password required, please try again");
    }
    if (password.length < 6) {
      throw new Error("Minimum password length must be 6 characters");
    }
    const verified = await jwt.verify(
      token.split(" ")[1],
      "N6e8O.SzPe1ixUc^f_hQ3"
    );
    if (!verified) {
      throw new Error("Token invalid, please try again");
    }
    const exists = await user.findOne({ where: { username: username } });

    if (!exists) {
      throw new Error("User does not exist");
    }
    const salt = await bcrypt.genSalt(7);
    const hash = await bcrypt.hash(password, salt);
    console.log(hash);

    const change = await user.update(
      { password: hash },
      { where: { username: username } }
    );
    console.log(change);
    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    res.status(405).send(error.message);
  }
});
router.put("/addordertouser", async (req, res) => {
  const { item, id, total } = req.body;
  try {
    if (!item) {
      throw new Error("Item required, please try again");
    }
    if (!id) {
      throw new Error("ID required, please try again");
    }

    const exists = await user.findOne({ where: { id: id } });

    if (!exists) {
      throw new Error("User does not exist");
    }

    const newList = [...exists.orders, { products: [...item], total: total }];

    const updated = await user.update(
      { orders: newList },
      { where: { id: id } }
    );
    res.status(200).send("Order Updaeted successfully");
  } catch (error) {
    res.status(405).send(error.message);
  }
});
router.post("/addorder", async (req, res) => {
  const { item, id, total } = req.body;
  try {
    if (!item) {
      throw new Error("Item required, please try again");
    }
    if (!id) {
      throw new Error("ID required, please try again");
    }

    const exists = await user.findOne({ where: { id: id } });

    if (!exists) {
      throw new Error("User does not exist");
    }

    await orders.create({ user: exists, product: item, total });

    res.status(200).send("Order Added successfully");
  } catch (error) {
    res.status(405).send(error.message);
  }
});
router.post("/alluserorders", async (req, res) => {
  const { id } = req.body;

  try {
    const exists = await user.findOne({ where: { id: id } });

    if (!exists) {
      throw new Error("User does not exist");
    }

    res.status(200).send(exists);
  } catch (error) {
    res.status(405).send(error.message);
  }
});
router.get("/allorders", async (req, res) => {
  try {
    const data = await orders.findAll();

    res.status(200).send(data);
  } catch (error) {
    res.status(405).send(error.message);
  }
});
router.get("/validate-admin", async (req, res) => {
  const token = req.headers.authorization;
  try {
    const verified = await jwt.verify(
      token.split(" ")[1],
      "N6e8O.SzPe1ixUc^f_hQ3"
    );

    const userIsAdmin = await user.findOne({ where: { id: verified.id } });

    if (userIsAdmin.isAdmin) {
      res.status(200).send("User is Admin");
    } else {
      throw new Error("User is not Admin");
    }
  } catch (error) {
    res.status(405).send("User not Verified");
  }
});

module.exports = router;
