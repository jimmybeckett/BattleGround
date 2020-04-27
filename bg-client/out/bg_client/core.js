// Compiled by ClojureScript 1.10.520 {}
goog.provide('bg_client.core');
goog.require('cljs.core');
goog.require('goog.string');
goog.require('clojure.string');
goog.require('goog.events');
bg_client.core.svg_grid_size = (1000);
bg_client.core.hex_height = (2);
bg_client.core.hex_width = 1.7320508;
bg_client.core.side_offset = (bg_client.core.svg_grid_size / (100));
bg_client.core.default_color = "antiquewhite";
bg_client.core.num_hexes_hor = (10);
bg_client.core.num_hexes_ver = (10);
bg_client.core.distance_color = "lightgrey";
bg_client.core.button_html_format_str = "<button type=\"button\" class=\"toolbar-button\"\nstyle=\"height: 20px; float: right; background-color: %s; width: 80%; outline: none;\"></button>";
bg_client.core.hex_html_format_str = "<use xlink:href=\"#hex-def\" class=\"hex\" %s%stransform=\"translate(%i, %i) scale(%i)\"/>";
bg_client.core._STAR_curr_cursor_color_STAR_ = bg_client.core.default_color;
bg_client.core.render_map = (function bg_client$core$render_map(hex_map){
return document.getElementById("hexes").innerHTML = clojure.string.join.call(null,"\n",hex_map);
});
bg_client.core.make_hex_map = (function bg_client$core$make_hex_map(num_hexes_hor,num_hexes_ver,color){
var make_hex_html_string = (function() { 
var G__530__delegate = function (x,y,scale,p__526){
var vec__527 = p__526;
var id = cljs.core.nth.call(null,vec__527,(0),null);
var fill = cljs.core.nth.call(null,vec__527,(1),null);
var id_str = (cljs.core.truth_(id)?goog.string.format("id=\"%s\" ",id):"");
var fill_str = (cljs.core.truth_(fill)?goog.string.format("fill=\"%s\" ",fill):"");
return goog.string.format(bg_client.core.hex_html_format_str,fill_str,id_str,x,y,scale);
};
var G__530 = function (x,y,scale,var_args){
var p__526 = null;
if (arguments.length > 3) {
var G__531__i = 0, G__531__a = new Array(arguments.length -  3);
while (G__531__i < G__531__a.length) {G__531__a[G__531__i] = arguments[G__531__i + 3]; ++G__531__i;}
  p__526 = new cljs.core.IndexedSeq(G__531__a,0,null);
} 
return G__530__delegate.call(this,x,y,scale,p__526);};
G__530.cljs$lang$maxFixedArity = 3;
G__530.cljs$lang$applyTo = (function (arglist__532){
var x = cljs.core.first(arglist__532);
arglist__532 = cljs.core.next(arglist__532);
var y = cljs.core.first(arglist__532);
arglist__532 = cljs.core.next(arglist__532);
var scale = cljs.core.first(arglist__532);
var p__526 = cljs.core.rest(arglist__532);
return G__530__delegate(x,y,scale,p__526);
});
G__530.cljs$core$IFn$_invoke$arity$variadic = G__530__delegate;
return G__530;
})()
;
var scale = (((bg_client.core.svg_grid_size / (function (){var x__4222__auto__ = num_hexes_hor;
var y__4223__auto__ = num_hexes_ver;
return ((x__4222__auto__ < y__4223__auto__) ? x__4222__auto__ : y__4223__auto__);
})()) / (2)) | (0));
var make_x = ((function (make_hex_html_string,scale){
return (function (row,col){
return ((bg_client.core.side_offset + ((bg_client.core.hex_width * scale) * ((cljs.core.even_QMARK_.call(null,row))?0.5:(1)))) + ((col * scale) * bg_client.core.hex_width));
});})(make_hex_html_string,scale))
;
var make_y = ((function (make_hex_html_string,scale,make_x){
return (function (row){
return ((bg_client.core.side_offset + ((bg_client.core.hex_height * scale) * 0.5)) + ((row * scale) * (bg_client.core.hex_height - 0.5)));
});})(make_hex_html_string,scale,make_x))
;
var make_hex = ((function (make_hex_html_string,scale,make_x,make_y){
return (function (row,col){
return make_hex_html_string.call(null,make_x.call(null,row,col),make_y.call(null,row),scale,((row * num_hexes_hor) + col),color);
});})(make_hex_html_string,scale,make_x,make_y))
;
return cljs.core.mapcat.call(null,((function (make_hex_html_string,scale,make_x,make_y,make_hex){
return (function (row){
return cljs.core.map.call(null,((function (make_hex_html_string,scale,make_x,make_y,make_hex){
return (function (col){
return make_hex.call(null,row,col);
});})(make_hex_html_string,scale,make_x,make_y,make_hex))
,cljs.core.range.call(null,num_hexes_hor));
});})(make_hex_html_string,scale,make_x,make_y,make_hex))
,cljs.core.range.call(null,num_hexes_ver));
});
bg_client.core.hex_distance = (function bg_client$core$hex_distance(r1,c1,r2,c2){
var abs_ver_distance = Math.abs((r1 - r2));
var abs_hor_distance = Math.abs((c1 - c2));
var diag_distance = Math.min(abs_ver_distance,(abs_hor_distance * (2)));
var rel_ver_distance = Math.max((abs_ver_distance - diag_distance),(0));
var rel_hor_distance = Math.max((abs_hor_distance - cljs.core.quot.call(null,diag_distance,(2))),(0));
return ((rel_ver_distance + rel_hor_distance) + diag_distance);
});
bg_client.core.display_distance = (function bg_client$core$display_distance(base_hex_id,hex_id){
var base_row = ((base_hex_id / bg_client.core.num_hexes_ver) | (0));
var base_col = cljs.core.mod.call(null,base_hex_id,bg_client.core.num_hexes_hor);
var hex_row = ((hex_id / bg_client.core.num_hexes_ver) | (0));
var hex_col = cljs.core.mod.call(null,hex_id,bg_client.core.num_hexes_hor);
var distance = bg_client.core.hex_distance.call(null,base_row,base_col,hex_row,hex_col);
return document.getElementById("distance").innerHTML = ["DISTANCE: ",cljs.core.str.cljs$core$IFn$_invoke$arity$1(distance)].join('');
});
bg_client.core.add_listener = (function bg_client$core$add_listener(listener,event,items){
return cljs.core.reduce.call(null,(function (idx,hex){
goog.events.listen(hex,event,(function (p1__533_SHARP_){
return listener.call(null,idx,p1__533_SHARP_);
}));

return (idx + (1));
}),(0),items);
});
bg_client.core.clear_listeners = (function bg_client$core$clear_listeners(items){
return cljs.core.reduce.call(null,(function (_,hex){
return cljs.core.println.call(null,goog.events.removeAll(hex));
}),items);
});
bg_client.core.get_hexes = (function bg_client$core$get_hexes(){
return cljs.core.array_seq.call(null,document.getElementsByClassName("hex"));
});
bg_client.core.add_hex_listener = (function bg_client$core$add_hex_listener(listener,event){
return bg_client.core.add_listener.call(null,listener,event,bg_client.core.get_hexes.call(null));
});
bg_client.core.clear_hex_listeners = (function bg_client$core$clear_hex_listeners(){
return bg_client.core.clear_listeners.call(null,bg_client.core.get_hexes.call(null));
});
bg_client.core.set_hex_fill = (function bg_client$core$set_hex_fill(hex_id,color){
return document.getElementById(hex_id).setAttribute("fill",color);
});
bg_client.core.anchor_distance = (function bg_client$core$anchor_distance(base_hex_id){
bg_client.core.clear_hex_listeners.call(null);

bg_client.core.set_hex_fill.call(null,base_hex_id,bg_client.core.distance_color);

return bg_client.core.add_hex_listener.call(null,(function (hex_id,_){
return bg_client.core.display_distance.call(null,base_hex_id,hex_id);
}),"mouseover");
});
bg_client.core.load_toolbar = (function bg_client$core$load_toolbar(colors){
var button_html_535 = cljs.core.map.call(null,(function (p1__534_SHARP_){
return goog.string.format(bg_client.core.button_html_format_str,p1__534_SHARP_);
}),colors);
document.getElementById("toolbar").innerHTML = clojure.string.join.call(null,"\n",button_html_535);

var buttons_536 = cljs.core.array_seq.call(null,document.getElementsByClassName("toolbar-button"));
cljs.core.reduce.call(null,((function (buttons_536){
return (function (idx,button){
goog.events.listen(button,"click",((function (buttons_536){
return (function (){
bg_client.core.clear_hex_listeners.call(null);

return bg_client.core.add_hex_listener.call(null,((function (buttons_536){
return (function (hex_id,_){
return bg_client.core.set_hex_fill.call(null,hex_id,cljs.core.nth.call(null,colors,idx));
});})(buttons_536))
,"click");
});})(buttons_536))
);

return (idx + (1));
});})(buttons_536))
,(0),buttons_536);

return goog.events.listen(document.getElementById("distance"),"click",(function (){
bg_client.core.clear_hex_listeners.call(null);

return bg_client.core.add_hex_listener.call(null,(function (hex_id,_){
return bg_client.core.anchor_distance.call(null,hex_id);
}),"click");
}));
});
bg_client.core.render_map.call(null,bg_client.core.make_hex_map.call(null,bg_client.core.num_hexes_hor,bg_client.core.num_hexes_ver,bg_client.core.default_color));
bg_client.core.load_toolbar.call(null,(new cljs.core.List(null,"red",(new cljs.core.List(null,"green",(new cljs.core.List(null,"blue",(new cljs.core.List(null,"yellow",(new cljs.core.List(null,"orange",(new cljs.core.List(null,"cyan",(new cljs.core.List(null,"pink",(new cljs.core.List(null,"purple",(new cljs.core.List(null,"black",(new cljs.core.List(null,"grey",(new cljs.core.List(null,"antiquewhite",null,(1),null)),(2),null)),(3),null)),(4),null)),(5),null)),(6),null)),(7),null)),(8),null)),(9),null)),(10),null)),(11),null)));

//# sourceMappingURL=core.js.map
