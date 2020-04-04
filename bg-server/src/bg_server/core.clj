(ns bg-server.core)

(use 'ring.adapter.jetty)
(use 'ring.util.response)
(use 'ring.middleware.file)

(defn handler [request]
  (file-response "index.html" {:root "bg-client"}))

(def app
  (wrap-file handler "bg-client"))

(run-jetty app {:port  3000
                :join? false})