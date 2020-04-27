(ns bg-client.core
  (:require
    [goog.string :as g-string]
    [clojure.string :as string]
    [goog.events :as g-events]))

;useful constants, most tied to numbers in index.html
(def svg-grid-size 1000)
(def hex-height 2)
(def hex-width 1.7320508)
(def side-offset (/ svg-grid-size 100))
(def default-color "antiquewhite")
(def num-hexes-hor 10)
(def num-hexes-ver 10)
(def distance-color "lightgrey")

;HTML format strings
(def button-html-format-str "<button type=\"button\" class=\"toolbar-button\"
style=\"height: 20px; float: right; background-color: %s; width: 80%; outline: none;\"></button>")
(def hex-html-format-str "<use xlink:href=\"#hex-def\" class=\"hex\" %s%stransform=\"translate(%i, %i) scale(%i)\"/>")

;global variables
(def ^:dynamic *curr-cursor-color* default-color)
;(def ^:dynamic *hex-listener* (fn [hex-id event] nil))

;functions
(defn render-map [hex-map]
  (set! (. (. js/document getElementById "hexes") -innerHTML) (string/join "\n" hex-map)))

(defn make-hex-map [num-hexes-hor num-hexes-ver color]
  (let [make-hex-html-string (fn [x y scale & [id fill]]
                               (let [id-str (if id (g-string/format "id=\"%s\" " id) "")
                                     fill-str (if fill (g-string/format "fill=\"%s\" " fill) "")]
                                 (g-string/format hex-html-format-str fill-str id-str x y scale)))
        scale (int (/ svg-grid-size (min num-hexes-hor num-hexes-ver) 2))
        make-x (fn [row, col] (+ side-offset (* hex-width scale (if (even? row) 0.5 1)) (* col scale hex-width)))
        make-y (fn [row] (+ side-offset (* hex-height scale 0.5) (* row scale (- hex-height 0.5))))
        make-hex (fn [row col] (make-hex-html-string
                                 (make-x row col) (make-y row) scale (+ (* row num-hexes-hor) col) color))]
    (mapcat (fn [row] (map (fn [col] (make-hex row col)) (range num-hexes-hor))) (range num-hexes-ver))))

; TODO: still a little bit broken lol
(defn hex-distance [r1 c1 r2 c2]
  (let [abs-ver-distance (Math/abs (- r1 r2))
        abs-hor-distance (Math/abs (- c1 c2))
        diag-distance (Math/min abs-ver-distance (* abs-hor-distance 2))
        rel-ver-distance (Math/max (- abs-ver-distance diag-distance) 0)
        rel-hor-distance (Math/max (- abs-hor-distance (quot diag-distance 2)) 0)]
    (+ rel-ver-distance rel-hor-distance diag-distance)))

(defn display-distance [base-hex-id hex-id]
  (let [base-row (int (/ base-hex-id num-hexes-ver))
        base-col (mod base-hex-id num-hexes-hor)
        hex-row (int (/ hex-id num-hexes-ver))
        hex-col (mod hex-id num-hexes-hor)
        distance (hex-distance base-row base-col hex-row hex-col)]
    (set! (. (. js/document getElementById "distance") -innerHTML) (str "DISTANCE: " distance))))

(defn add-listener [listener event items]
  (reduce (fn [idx hex] (do (g-events/listen hex event #(listener idx %)) (+ idx 1))) 0 items))

(defn clear-listeners [items]
  (reduce (fn [_ hex] (println (g-events/removeAll hex))) items))

(defn get-hexes []
  (array-seq (. js/document getElementsByClassName "hex")))

(defn add-hex-listener [listener event]
  (add-listener listener event (get-hexes)))

(defn clear-hex-listeners []
  (clear-listeners (get-hexes)))

(defn set-hex-fill [hex-id color]
  (. (. js/document getElementById hex-id) setAttribute "fill" color))

(defn anchor-distance [base-hex-id]
  (clear-hex-listeners)
  (set-hex-fill base-hex-id distance-color)
  (add-hex-listener (fn [hex-id _] (display-distance base-hex-id hex-id)) "mouseover"))

(defn load-toolbar [colors]
  (do
    (let [button-html (map #(g-string/format button-html-format-str %) colors)]
      (set! (. (. js/document getElementById "toolbar") -innerHTML) (string/join "\n" button-html))))
  (let [buttons (array-seq (. js/document getElementsByClassName "toolbar-button"))]
    (reduce (fn [idx button]
              (do (g-events/listen button "click"
                                   #(do (clear-hex-listeners)
                                     (add-hex-listener (fn [hex-id _] (set-hex-fill hex-id (nth colors idx))) "click")))
                  (+ idx 1)))
            0 buttons))
  (g-events/listen (. js/document getElementById "distance") "click"
                   #(do (clear-hex-listeners)
                        (add-hex-listener (fn [hex-id _] (anchor-distance hex-id))
                                          "click"))))


;code executed on page load
(render-map (make-hex-map num-hexes-hor num-hexes-ver default-color))
(load-toolbar (list "red" "green" "blue" "yellow" "orange" "cyan" "pink" "purple" "black" "grey" "antiquewhite"))