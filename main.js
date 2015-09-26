function lookup(resource, query, next, error) {
    var query_params = query;
    var url          = ('https://soda.demo.socrata.com/resource/' + resource
                        + obj_to_urlstring(query_params));
    
    $.ajax({url: url,
            method 'GET'})
        .done(next)
        .fail(error); }
