/**
 * @file exposes the app object instantiated so other modules can
 * require it and share events across the entire application
 */

var express = require("express");
var config = require("./config/config.json");
var app = module.exports = exports = express();
var path = require("path");
var include = require("include");
var mvc = include.lib("mvc");
var flash = require("express-flash");

// Alloy all configuration to be available in app.config
app.config = config;

// all environments
mvc.EnableMultipeViewsFolders(app);
app.set('port', process.env.PORT || 3000);
app.set('views', [path.join(__dirname, 'views')]);
app.set('view engine', 'jade');
app.locals.basedir = path.join(__dirname, 'views');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('keyboard cat'));
app.use(express.session({ cookie: { maxAge: 60000 }}));
app.use(flash());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

/** 
 * Autodetect all views in modules 
 */
var modules = config.modules;
modules.forEach(function(module) {
	mvc.addView(app, path.join(__dirname, "modules", module));
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}