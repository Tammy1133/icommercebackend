const { product } = require("../models");
const { todo } = require("../models");
const cloudinary = require("../utils/cloudinary");
console.log(process.env.SECRET);

const router = require("express").Router();

router.get("/allproducts", async (req, res) => {
  try {
    const data = await product.findAll();
    res.status(200).send({ message: "Successful", products: data });
  } catch (error) {
    res.status(405).send(error.message);
  }
});

router.post("/addproduct", async (req, res) => {
  const { name, price, description, image, category } = req.body;
  try {
    if (!name) {
      throw new Error("Name Required");
    }
    if (!price) {
      throw new Error("Price Required");
    }
    if (!description) {
      throw new Error("Description Required");
    }
    if (!image) {
      throw new Error("Image Required");
    }
    if (!category) {
      throw new Error("Category Required");
    }
    const saveImage = await cloudinary.uploader.upload(image, {
      folder: "Icommerce",
    });

    console.log(saveImage);
    const data = await product.create({
      name,
      price,
      description,
      category,
      image: saveImage.secure_url,
    });
    res
      .status(200)
      .send({ message: "Product Successfully Added", products: data });
  } catch (error) {
    console.log(error);
    res.status(405).send(error.message);
  }
});

router.delete(`/deleteproduct/:id`, async (req, res) => {
  try {
    const exists = await product.findOne({ where: { id: req.params.id } });
    if (!exists) {
      throw new Error("Product not found");
    } else {
      await product.destroy({ where: { id: req.params.id } });
      res.status(200).send("Product deleted");
    }
  } catch (error) {
    res.status(405).send(error.message);
  }
});
router.put(`/editproduct`, async (req, res) => {
  const { id, name, price, description, image, category } = req.body;

  try {
    const exists = await product.findOne({ where: { id } });
    if (!exists) {
      throw new Error("Product not found");
    } else {
      const saveImage = await cloudinary.uploader.upload(image, {
        folder: "Icommerce",
      });
      console.log(saveImage);
      await product.update(
        { name, price, description, image: saveImage.secure_url, category },
        { where: { id } }
      );
      res.status(200).send("Product updated successfuully");
    }
  } catch (error) {
    res.status(405).send(error.message);
  }
});
module.exports = router;
