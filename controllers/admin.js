const Product = require("../models/product");

exports.getAddProducts = (req, res, next) => {
    res.render("admin/edit-product", { 
        pageTitle: "Add Product" ,
        edit : false
    });
};

exports.addNewProducts = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const desc = req.body.desc;
    const price = req.body.price;

    const product = new Product(null, title, imageUrl, desc, price);
    product.save();
    res.redirect("/");
};

exports.editProducts = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect("/");
    }
    // fetch product data
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if(!product){
            return res.redirect('/');
        }
        res.render("admin/edit-product", {
            pageTitle: "Edit Product",
            edit: editMode,
            product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.prodId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedDesc = req.body.desc;
    const updatedImage = req.body.imageUrl;
    const product = new Product(prodId, updatedTitle, updatedImage, updatedDesc, updatedPrice);
    product.save();
    res.redirect("/admin/product-list");
}

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.deleteProdById(prodId);
    res.redirect("/admin/product-list");
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render("admin/product-list", {
            prods: products,
            pageTitle: "Admin products",
            path: "/admin/product-list"
        });
    });
};
