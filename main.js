var king_county_parcels     = 'yrp3-3hu8';
var commercial_buildings    = 'b6gg-b3a4';
var vacant_lots             = 'mdtz-kt2d';
var employment_stats        = '6bn5-2933';
var liquor_licenses         = 'mjvz-43ce';
var kenmore_zip             = 98028;

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


