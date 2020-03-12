const express = require('express');
const validate = require('express-validation');
const controller = require('../controllers/item');
const { listItems, createItem, updateItem } = require('../validations/item');
const cleanCache = require('../middleware/cleanCache')
const router = express.Router();

/**
 * Load item when API with itemCode route parameter is hit
 */
router.param('itemId', controller.load);


router
    .route('/')
    /**
     * @api {get}  /items List Items
     * @apiDescription Get a list of items
     * @apiVersion 1.0.0
     * @apiName ListItems
     * @apiGroup Item
     *
     * @apiHeader {String} Authorization   Item's access token
     *
     * @apiParam  {Number{1-}}         [page=1]        List page
     * @apiParam  {Number{1-100}}      [perPage=1]     Items per page
     * @apiParam  {String}             [name]          Item's name
     * @apiParam  {String}             [itemCode]      Item's code
     * @apiParam  {String}             [barcode]       Item's barcode
     * @apiParam  {String}             [itemGroup]     Item's group
     * @apiParam  {String}             [id]            Item's id
     * 
     *
     * @apiSuccess {Object[]} items List of items.
     *
     * @apiError (Unauthorized 401)  Unauthorized  Only authenticated items can access the data
     * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
     */
    .get(validate(listItems), controller.list)
    /**
     * @api {post}  /items Create Item
     * @apiDescription Create a new item
     * @apiVersion 1.0.0
     * @apiName CreateUser
     * @apiGroup Item
     *
     * @apiHeader {String} Authorization   Item's access token
     *
     * @apiParam  {String}    [name]          Item's name
     * @apiParam  {String}    [itemCode]      Item's code
     * @apiParam  {String}    [barcode]       Item's barcode
     * @apiParam  {String}    [itemGroup]     Item's group
     *
     * @apiSuccess (Created 201) {String}  id               Item's id
     * @apiSuccess (Created 201) {String}  name             Item's name
     * @apiSuccess (Created 201) {String}  itemgroup        Item's group
     * @apiSuccess (Created 201) {String}  barcode          Item's barcode
     * @apiSuccess (Created 201) {String}  itemcode         Item's code
     * @apiSuccess (Created 201) {Date}    createdAt        Timestamp
     * 
     * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401)  Unauthorized     Only authenticated items can create the data
     * @apiError (Forbidden 403)     Forbidden        Only admins can create the data
     */
    .post(validate(createItem), cleanCache, controller.create);

router
    .route('/:itemId')
    /**
     * @api {get}  /items/:id Get Item
     * @apiDescription Get item information
     * @apiVersion 1.0.0
     * @apiName GetItem
     * @apiGroup Item
     * @apiPermission item
     *
     * @apiHeader {String} Authorization   Item's access token
     *
     * @apiSuccess (Created 201) {String}  id               Item's id
     * @apiSuccess (Created 201) {String}  name             Item's name
     * @apiSuccess (Created 201) {String}  itemgroup        Item's group
     * @apiSuccess (Created 201) {String}  barcode          Item's barcode
     * @apiSuccess (Created 201) {String}  itemcode         Item's code
     * @apiSuccess (Created 201) {Date}    createdAt        Timestamp
     *
     * @apiError (Unauthorized 401) Unauthorized Only authenticated items can access the data
     * @apiError (Forbidden 403)    Forbidden    Only item with same id or admins can access the data
     * @apiError (Not Found 404)    NotFound     Item does not exist
     */
    .get(controller.get)
    /**
     * @api {patch}  /items/:id Update Item
     * @apiDescription Update some fields of a item document
     * @apiVersion 1.0.0
     * @apiName UpdateUser
     * @apiGroup Item
     * @apiPermission item
     *
     * @apiHeader {String} Authorization   Item's access token
     *
     * @apiParam  {String}    [name]          Item's name
     * @apiParam  {String}    [itemCode]      Item's code
     * @apiParam  {String}    [barcode]       Item's barcode
     * @apiParam  {String}    [itemGroup]     Item's group
     * 
     * @apiSuccess {String}  id               Item's id
     * @apiSuccess {String}  name             Item's name
     * @apiSuccess {String}  itemgroup        Item's group
     * @apiSuccess {String}  barcode          Item's barcode
     * @apiSuccess {String}  itemcode         Item's code
     * @apiSuccess {Date}    createdAt        Timestamp
     *
     * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
     * @apiError (Unauthorized 401) Unauthorized Only authenticated items can modify the data
     * @apiError (Forbidden 403)    Forbidden    Only item with same id or admins can modify the data
     * @apiError (Not Found 404)    NotFound     Item does not exist
     */
    .patch(validate(updateItem), cleanCache, controller.update)
    /**
     * @api {patch}  /items/:id Delete Item
     * @apiDescription Delete a item
     * @apiVersion 1.0.0
     * @apiName DeleteUser
     * @apiGroup Item
     * @apiPermission item
     *
     *
     * @apiSuccess (No Content 204)  Successfully deleted
     *
     * @apiError (Unauthorized 401) Unauthorized  Only authenticated items can delete the data
     * @apiError (Forbidden 403)    Forbidden     Only item with same id or admins can delete the data
     * @apiError (Not Found 404)    NotFound      Item does not exist
     */
    .delete(cleanCache, controller.remove);


module.exports = router;
