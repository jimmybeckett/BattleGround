(ns bg-client.core
  (:require
    [goog.string :as gstring]
    [clojure.string :as string]))

;useful constants, most tied to numbers in index.html
(def svg-grid-size 1000)
(def hex-height 2)
(def hex-width 1.7320508)
(def side-offset (/ svg-grid-size 100))
(def default-color "grey")

;HTML format strings
(def button-html-format-str "<button type=\"button\" class=\"toolbar-button\"
style=\"height: 20px; float: right; background-color: %s; width: 80%; outline: none;\"></button>")
(def hex-html-format-str "<use xlink:href=\"#hex-def\" class=\"hex\" %s%stransform=\"translate(%i, %i) scale(%i)\"/>")

;global variables
(def ^:dynamic *curr-cursor-color* default-color)

;functions
(defn render-map [hex-map]
  (set! (. (. js/document getElementById "hexes") -innerHTML) (string/join "\n" hex-map)))

(defn make-hex-map [num-hexes-hor num-hexes-ver color]
  (let [make-hex-html-string (fn [x y scale & [id fill]]
                               (let [id-str (if id (gstring/format "id=\"%s\" " id) "")
                                     fill-str (if fill (gstring/format "fill=\"%s\" " fill) "")]
                                 (gstring/format hex-html-format-str fill-str id-str x y scale)))
        scale (int (/ svg-grid-size (min num-hexes-hor num-hexes-ver) 2))
        make-x (fn [row, col] (+ side-offset (* hex-width scale (if (even? row) 0.5 1)) (* col scale hex-width)))
        make-y (fn [row] (+ side-offset (* hex-height scale 0.5) (* row scale (- hex-height 0.5))))
        make-hex (fn [row col] (make-hex-html-string
                                 (make-x row col) (make-y row) scale (+ (* row num-hexes-hor) col) color))]
    (mapcat (fn [row] (map (fn [col] (make-hex row col)) (range num-hexes-hor))) (range num-hexes-ver))))
1
(defn load-toolbar [colors]
  (do
    (let [buttons (map #(gstring/format button-html-format-str %) colors)]
      (set! (. (. js/document getElementById "toolbar") -innerHTML) (string/join "\n" buttons))))
    (let [buttons (array-seq (. js/document getElementsByClassName "toolbar-button"))
          button-listener #(set! *curr-cursor-color* (nth colors %))]
      (reduce (fn [idx button] (do (.addEventListener button "click" #(button-listener idx) false) (+ idx 1)))
              0 buttons)))

(defn load-event-listener []
  (let [hexes (array-seq (. js/document getElementsByClassName "hex"))
        set-hex-fill (fn [hex-id color] (. (. js/document getElementById (str hex-id)) setAttribute "fill" color))]
    (reduce (fn [idx hex] (do (.addEventListener hex "click" #(set-hex-fill idx *curr-cursor-color*) false) (+ idx 1)))
            0 hexes)))

;code executed on page load
(render-map (make-hex-map 20 20 default-color))
(load-toolbar (list "red" "green" "blue" "purple" "black" "grey"))
(.addEventListener js/window "load" load-event-listener false)