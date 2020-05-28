const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render("shop/product-list", {
                prods: products,
                pageTitle: "Shop Page",
                path: "/product-list"
            });
        })
        .catch(e => console.log(e));
};

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (product) {
                res.render("shop/product-detail", {
                    product,
                    pageTitle: product.title
                });
            } else {
                return res.status(401).send("Product not found");
            }
        })
        .catch(e => console.log(e));
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render("shop/index", {
                prods: products,
                pageTitle: "Shop Page",
                path: "/products"
            });
        })
        .catch(e => console.log(e));
};

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: products
            });
        })
        .catch();
};

exports.addCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect("/cart");
        });
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders()
        .then(orders => {
            console.log(orders);
            res.render("shop/orders", {
                path: "/orders",
                pageTitle: "Your Order",
                orders
            });
        })
        .catch(e => {
            console.log(e);
        });
};

exports.deleteCartProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .deleteItemFromCart(prodId)
        .then(() => {
            res.redirect("/cart");
        })
        .catch(e => console.log(e));
};

exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout"
    });
};

exports.createOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .addOrder()
        .then(() => {
            return res.redirect("/orders");
        })
        .catch(e => console.log(e));
};
