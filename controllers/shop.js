const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
    Product.findAll()
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
    Product.findByPk(productId)
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
    Product.findAll()
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
        .then(cart => {
            return cart.getProducts();
        })
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
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId } });
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            let newQty = 1;
            if (product) {
                const oldQty = product.cartItem.quantity;
                newQty += oldQty;
                return fetchedCart.addProduct(product, {
                    through: { quantity: newQty }
                });
            }
            return Product.findByPk(productId)
                .then(product => {
                    if (!product) {
                        return res.status(401).send("Product not found");
                    }
                    return fetchedCart.addProduct(product, {
                        through: { quantity: newQty }
                    });
                })
                .catch(e => console.log(e));
        })
        .then(() => {
            res.redirect("/cart");
        })
        .catch(e => console.log(e));
};

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({include: ['products']})
        .then(orders => {
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
        .getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
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
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(
                        products.map(product => {
                            product.orderItem = {
                                quantity: product.cartItem.quantity
                            };
                            return product;
                        })
                    );
                })
                .catch(e => console.log(e));
        })
        .then(() => {
            return fetchedCart.setProducts(null);
        })
        .then(() => {
            return res.redirect("/orders");
        })
        .catch(e => console.log(e));
};
