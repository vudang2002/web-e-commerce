/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *         avatar:
 *           type: string
 *           description: URL to user's profile picture
 *         role:
 *           type: string
 *           enum: [user, admin, seller]
 *           description: The user's role in the system
 *         isSeller:
 *           type: boolean
 *           description: Whether the user is a seller
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation date
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Account last update date
 *       required:
 *         - name
 *         - email
 *         - password
 * 
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The product ID
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Detailed product description
 *         price:
 *           type: number
 *           description: Regular product price
 *         salePrice:
 *           type: number
 *           description: Discounted price (if applicable)
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of product image URLs
 *         category:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *           description: Product category
 *         brand:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *           description: Product brand
 *         stock:
 *           type: number
 *           description: Available quantity
 *         rating:
 *           type: number
 *           description: Average product rating
 *         numReviews:
 *           type: number
 *           description: Number of reviews
 *         features:
 *           type: array
 *           items:
 *             type: string
 *           description: Key product features
 *         specifications:
 *           type: object
 *           description: Technical specifications as key-value pairs
 *         isActive:
 *           type: boolean
 *           description: Whether the product is active/available
 *         createdBy:
 *           type: string
 *           description: User ID of product creator
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - price
 *         - category
 *         - stock
 * 
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The category ID
 *         name:
 *           type: string
 *           description: Category name
 *         slug:
 *           type: string
 *           description: URL-friendly name
 *         description:
 *           type: string
 *           description: Category description
 *         image:
 *           type: string
 *           description: Category image URL
 *         parent:
 *           type: string
 *           description: Parent category ID (for hierarchical categories)
 *         isActive:
 *           type: boolean
 *           description: Whether the category is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 * 
 *     Brand:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The brand ID
 *         name:
 *           type: string
 *           description: Brand name
 *         logo:
 *           type: string
 *           description: Brand logo URL
 *         description:
 *           type: string
 *           description: Brand description
 *         website:
 *           type: string
 *           description: Brand official website
 *         isActive:
 *           type: boolean
 *           description: Whether the brand is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 * 
 *     Review:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The review ID
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             avatar:
 *               type: string
 *           description: User who wrote the review
 *         product:
 *           type: string
 *           description: Product ID being reviewed
 *         rating:
 *           type: number
 *           minimum: 1
 *           maximum: 5
 *           description: Rating from 1-5
 *         comment:
 *           type: string
 *           description: Review text content
 *         title:
 *           type: string
 *           description: Review title
 *         images:
 *           type: array
 *           items:
 *             type: string
 *           description: Images attached to the review
 *         isVerified:
 *           type: boolean
 *           description: Whether the reviewer is a verified purchaser
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - user
 *         - product
 *         - rating
 * 
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The order ID
 *         orderNumber:
 *           type: string
 *           description: Unique order number
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *           description: User who placed the order
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   image:
 *                     type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *           description: Products ordered
 *         shippingAddress:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *             city:
 *               type: string
 *             postalCode:
 *               type: string
 *             country:
 *               type: string
 *             phone:
 *               type: string
 *           description: Delivery address
 *         paymentMethod:
 *           type: string
 *           enum: [COD, PayPal, Credit Card, Bank Transfer, Momo]
 *           description: Payment method
 *         paymentResult:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             status:
 *               type: string
 *             update_time:
 *               type: string
 *             email_address:
 *               type: string
 *           description: Payment transaction details
 *         subtotal:
 *           type: number
 *           description: Order subtotal before discounts
 *         shippingFee:
 *           type: number
 *           description: Shipping fee
 *         tax:
 *           type: number
 *           description: Tax amount
 *         discount:
 *           type: number
 *           description: Discount amount
 *         total:
 *           type: number
 *           description: Final order total
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled, refunded]
 *           description: Order status
 *         isPaid:
 *           type: boolean
 *           description: Whether the order has been paid
 *         paidAt:
 *           type: string
 *           format: date-time
 *           description: When the order was paid
 *         isDelivered:
 *           type: boolean
 *           description: Whether the order has been delivered
 *         deliveredAt:
 *           type: string
 *           format: date-time
 *           description: When the order was delivered
 *         voucher:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             code:
 *               type: string
 *           description: Applied voucher
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - user
 *         - items
 *         - shippingAddress
 *         - paymentMethod
 * 
 *     Voucher:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The voucher ID
 *         code:
 *           type: string
 *           description: Voucher code to be entered by users
 *         type:
 *           type: string
 *           enum: [percentage, fixed]
 *           description: Discount type (percentage or fixed amount)
 *         value:
 *           type: number
 *           description: Discount value (percentage or amount)
 *         minOrderValue:
 *           type: number
 *           description: Minimum order value required to use voucher
 *         maxDiscount:
 *           type: number
 *           description: Maximum discount amount (for percentage vouchers)
 *         startDate:
 *           type: string
 *           format: date-time
 *           description: Voucher valid from
 *         expireAt:
 *           type: string
 *           format: date-time
 *           description: Voucher expiration date
 *         usageLimit:
 *           type: number
 *           description: Maximum number of times voucher can be used
 *         usedCount:
 *           type: number
 *           description: Number of times voucher has been used
 *         isActive:
 *           type: boolean
 *           description: Whether the voucher is active
 *         description:
 *           type: string
 *           description: Voucher description
 *         applyTo:
 *           type: object
 *           properties:
 *             categories:
 *               type: array
 *               items:
 *                 type: string
 *             products:
 *               type: array
 *               items:
 *                 type: string
 *           description: Categories or products voucher applies to
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - code
 *         - type
 *         - value
 *         - expireAt
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Resource not found"
 * 
 *     ValidationErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 *           example:
 *             - msg: "Name is required"
 *               param: "name"
 *             - msg: "Invalid email format"
 *               param: "email"
 */
