var king_county_parcels     = 'yrp3-3hu8';
var commercial_buildings    = 'b6gg-b3a4';
var vacant_lots             = 'mdtz-kt2d';
var employment_stats        = '6bn5-2933';
var liquor_licenses         = 'mjvz-43ce';
var kenmore_zip             = 98028;
var kenmore_coords          = [47.752778, -122.247222];
var mapbox_id               = 'davidkarn.ni38i7gd';
var mapbox_access_token     = ('pk.eyJ1IjoiZGF2aWRrYXJuIiwiYSI6ImNpZjFmdXlpYzBmbDB'
                               + 'zcW01bDF3b3kyMTIifQ.-ilX5JP9cl1MrPMQUZJ6Gw');
var map;
var building_data;
var building_types          = [];
var layers                  = {};
var saved_coords            = {};
var heatmap_layer_options   = 
        {vacancies:  {},
         employees:  {blur:        100,
                      minOpacity:  0.2,
                      radius:      40},
         buildings:  {}};

employees = employees.map(function(e) {
    return [e[1], e[0]]; });

function lookup(resource, query, next, error) {
    var query_params = {};
    if (query.where)
        query_params['$where'] = query.where.join(" AND ");
    
    var url          = ('https://kenmorewa.data.socrata.com/resource/' + resource
                        + '?' + obj_to_urlstring(query_params));
    
    $.ajax({url:      url,
            method:  'GET'})
        .done(next)
        .fail(error); }

function in_kenmore(query) {
    query = query || {};
    query.where = query.where || [];
    query.where.push("zip_code='" + kenmore_zip + "'");
    return query; }

function in_kenmore_parcel(query) {
    query = query || {};
    query.where = query.where || [];
    query.where.push('zip_code = ' + kenmore_zip);
    return query; }

function socrata_commercial_buildings_latlngs(next) {
    socrata_latlngs(commercial_buildings, next); }

function socrata_vacant_lots_latlngs(next) {
    socrata_latlngs(vacant_lots, next); }

function socrata_latlngs(dataset, next) {
    lookup(dataset, in_kenmore(),
           function(buildings) {
               if (dataset == commercial_buildings) {
                   building_data   = buildings;
                   filter_commercial_buildings(); }
               var coords = socrata_coords(buildings);
               next(coords); }); }

function socrata_coords(buildings) {
    var coords = buildings.map(function(building) {
        return [parseFloat(building.latitude), parseFloat(building.longitude)]; });
    return coords; }
               
function plot_coords_heat(coords, layer) {
    saved_coords[layer]   = coords;
    layer                 = layer || Math.random().toString();
    var map_layer         = layers[layer];
    
    if (map_layer) {
        map_layer.setLatLngs(coords);
        map_layer.redraw(); }
    else {
        var options     = heatmap_layer_options[layer];
        layers[layer]   = L.heatLayer(coords, options);
        layers[layer].addTo(map); }}

function filter_commercial_buildings() {
    building_data.map(function(b) {
        building_types.push({label: b.predominant_use}); });
    
    for (var i in building_types) {
        var type    = building_types[i];
        var id      = Math.random().toString().slice(2);
        var el      = build_el(label({for: id},
                                     [_input({type: 'checkbox', id: id}),
                                      type.label]));
        var input   = el.find('input');
        
        input.change(re_draw_buildings);
        building_types[i].input = input;
        el.appendTo($('#building_types')); } }

function re_draw_buildings() {
    var avail_types = [];
    building_types.map(function(type) {
        if (type.input.prop('checked'))
            avail_types.push(type.label); });
    
    var data = building_data.filter(function(building) {
        return member(avail_types, building.predominant_use); });
    plot_coords_heat(socrata_coords(data), 'buildings'); }
    
function init_map() {
    map = L.map('map')
        .setView(kenmore_coords, 13);

    layers.google_satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
        maxZoom:       20,
        subdomains:  ['mt0','mt1','mt2','mt3'],
        opacity:       0 });
    
    layers.google_satellite.addTo(map);
    layers.osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                             {attribution: 'osm',
                             opacity: 1});
    layers.osm.addTo(map);

    return map; }

function re_draw() {
    var osm           = $('#osm').prop('checked');
    var satellite     = $('#satellite').prop('checked');
    var heat_layers   = ['vacancies', 'employees', 'buildings'];

    heat_layers.map(function(layer) {
        if (!$('#' + layer).prop('checked'))
            layers[layer].setLatLngs([]);
        else
            layers[layer].setLatLngs(saved_coords[layer]); });

    layers.osm.setOpacity(osm ? 1 : 0);
    layers.google_satellite.setOpacity(satellite ? 1 : 0); }

$(document).ready(function() {
    init_map();
    plot_coords_heat(employees, 'employees');
    socrata_commercial_buildings_latlngs(curry(plot_coords_heat, undefined, 'buildings'));
    setTimeout(function() {
        socrata_vacant_lots_latlngs(curry(plot_coords_heat, undefined, 'vacancies')); }, 1000);

    $('input').change(re_draw); });
