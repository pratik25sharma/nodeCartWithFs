const Product = require("../models/product");

exports.getAddProducts = (req, res, next) => {
    res.render("admin/edit-product", {
        pageTitle: "Add Product",
        edit: false
    });
};

exports.addNewProducts = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const desc = req.body.desc;
    const price = req.body.price;
    req.user
        .createProduct({
            title,
            imageUrl,
            description: desc,
            price
        })
        .then(result => {
            return res.redirect("/");
        })
        .catch(e => console.log(e));
};

exports.editProducts = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    // fetch product data
    const prodId = req.params.productId;
    req.user
        .getProducts({ where: { id: prodId } })
        .then(products => {
            const product = products[0];
            if (!product) {
                return res.redirect("/");
            }
            res.render("admin/edit-product", {
                pageTitle: "Edit Product",
                edit: editMode,
                product
            });
        })
        .catch(e => console.log(e));
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.prodId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.desc;
    const updatedImage = req.body.imageUrl;

    Product.findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImage;
            return product.save();
        })
        .then(result => res.redirect("/admin/product-list"))
        .catch(e => console.log(e));
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => product.destroy())
        .then(result => res.redirect("/admin/product-list"))
        .catch(e => console.log(e));
};

exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then(products => {
            res.render("admin/product-list", {
                prods: products,
                pageTitle: "Admin products",
                path: "/admin/product-list"
            });
        })
        .catch(e => console.log(e));
};
