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

function init_map() {
    map = L.map('map')
        .setView(kenmore_coords, 13);
    // L.tileLayer('https://api.tile.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
    //             {attribution:  '',
    //              maxZoom:      18,
    //              id:           mapbox_id,
    //              accessToken:  mapbox_access_token})
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {attribution: 'osm'})
        .addTo(map);
    return map; }

$(document).ready(function() {
    init_map(); });
