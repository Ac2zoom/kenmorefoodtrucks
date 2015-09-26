function curry(that) {
    var args = to_array(arguments).slice(1);

    return function() {
	var oldargs = args.slice(0);
	var newargs = to_array(arguments);
	var j = 0;
	for (var i in oldargs)
	    if (oldargs[i] == undefined) {
		oldargs[i] = newargs[j];
		j += 1; }

	var as = oldargs.concat(newargs.slice(j));

	return that.apply(that, as); }};

function to_array(what) {
    var i; 
    var ar = [];
 
    for (i = 0; i < what.length; i++) {
	ar.push(what[i]); }

    return ar; }

function setter(key, to) {
    return function(obj) {
	obj[key] = to; 
	return obj; }; }

function add_to_set(list, value) {
    if (list.indexOf(value) >= 0)
	return list;

    return list.concat(value); }

function remove_from_set(list, value) {
    var index = list.indexOf(value);
    if (index == -1)
	return list;
    
    return list.slice(0, index)
	.concat(list.slice(index + 1)); }

function combiner(key) {
    return function(a, b) {
	return a[key](b); }; }

function toggle(obj, key) {
    obj[key] = !obj[key];
    return obj; }

function toggler(key) {
    return function(obj) {
	obj[key] = !obj[key]; }; }

function do_nothing() {}


function key_lookup(array, value) {
    for (var i in array) 
	if (array[i] == value)
	    return i;

    return false; }



function popup($modal, template, then, controller, resolve) {
    var modal = $modal.open({
	templateUrl: 'templates/' + template,
	resolve: (resolve || {}),
	controller: (controller || 'PopupModal')});
    
    if (then) 
	modal.result.then(then); 

    return modal; }

function relocator($location, path) {
    return function() {
	$location.path(path); }; }

function relocator_with_ids($location, path, users_list, key) {
    return function() {
	$location.path(path + "/" 
		       + (users_list.filter(param_returner(key))
			  .map(param_returner('id'))
			  .join(","))); }; }

function sum(a, b) {
    return a + b; }

function setup_relocators($scope, $location, setup) {
    for (var key in setup) 
	$scope[key] = relocator($location, setup[key]); }

function opfn(fn) {
    return function(a) {
	return !fn(a); }; }

function o(fn1, fn2) {
    return function(a) {
	return fn1(fn2(a)); }; }

function param_returner(param_name) {
    return function(obj) {
	return obj[param_name]; }; }

function comma_list_contains(list, contains) {
    return (list
	    .split(",")
	    .indexOf(contains)) > -1; }

function clone(i) {
    if (i instanceof Array)
        return i.slice(o);

    if (typeof i != "object")
        return i;
    
    var o = {};
    for (var j in i) 
        o[j] = clone(i[j]); 
    return o; }

function toast(type, message) {
    toastr.options = {
	"closeButton": true,
	"debug": false,
	"positionClass": "toast-bottom-right",
	"onclick": null,
	"showDuration": "300",
	"hideDuration": "1000",
	"timeOut": "5000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
    }

    toastr[type](message); }

function hash(obj) {
    if (typeof obj != "string")
        obj = JSON.stringify(obj); 
    var hash = 0, i, chr, len;
    if (obj.length == 0) return hash;
    for (i = 0, len = obj.length; i < len; i++) {
        chr   = obj.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer 
    }
    return hash;
}

function member(ar, value) {
    return ar.indexOf(value) >= 0; }

function name_to_label(str) {
    return str.split(/_-/)
        .map(function (s) { 
            return s[0].toUpperCase() + s.slice(1); })
        .join(" "); }

function array_values(ar) {
    var r = [];
    for (var i in ar)
        r.push(ar[i]);
    return r; }

function obj_to_urlstring(obj) {
    var strs = [];

    for (var key in obj)
        strs.push(key + "=" + encodeURIComponent(obj[key]));

    return strs.join("&"); }

function prepend(el, to) {
    var chldren = to.childNodes;
    if (children.length == 0)
        to.appendChild(el);
    else
        to.insertBefore(el, children[0]);
    return el; }


function hash(obj) {
    if (typeof obj != "string")
        obj = JSON.stringify(obj); 
    var hash = 0, i, chr, len;
    if (obj.length == 0) return hash;
    for (i = 0, len = obj.length; i < len; i++) {
        chr   = obj.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer 
  }
  return hash;
}

function tag_maker(tag) {
    return function(klass, children, click) {
        click = click || do_nothing;
        var obj;

        if (typeof klass != "string") 
            obj = klass;
        else
            obj = {"class": klass};

        obj.tag = tag;
        obj.children = children;
        obj.click = click;
        return obj; }; }

var div =    tag_maker('div');
var span =   tag_maker('span');
var button = tag_maker('button');
var a =      tag_maker('a');
var i =      tag_maker('i');
var img =    tag_maker('img');
var strong = tag_maker('strong');
var p =      tag_maker('p');
var select = tag_maker('select');
var _input  = tag_maker('input');
var option = tag_maker('option');
var label  = tag_maker('label');
var textarea = tag_maker('textarea');

function br() {
    return {tag: 'br'}; }

function build_el(el) {
    if (el === null) 
        el = {tag: "div"}; 
    if (typeof el == "string") 
        return $(document.createTextNode(el)); 

    var attrs = {};
    for (var i in el) 
        if (i != 'tag'
            && i != 'click'
            && i != 'children')
            attrs[i] = el[i];

    var element = $('<' + el.tag + '/>', attrs);
    if (el.click)
        element.click(el.click);

    var children = (el.children || [])
            .map(build_el);
    for (i in children) 
        element.append(children[i]);

    return element; }

function uniq(ar) {
    var found = [];

    for (var i in ar)
        if (found.indexOf(ar[i]) < 0)
            found.push(ar[i]);

    return found; }
