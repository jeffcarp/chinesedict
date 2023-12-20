package main

import (
	"net/http"
	"math"
)

func resultsHandler(w http.ResponseWriter, r *http.Request) {
		query := r.URL.Query().Get("q")

		// TODO: First look up exact match on Chinese chars, if exists redirect
		// to that word page.

		entries := globalDict.Lookup(query)
		entries = entries[:int(math.Min(float64(len(entries)), 200.0))]

		data := struct {
			Entries		[]*Entry
			HeaderData HeaderData
			Query		string
		}{
			Entries:       entries,
			HeaderData: HeaderData{Subtitle: query},
			Query:		query,
		}

		err := wordTemplate.ExecuteTemplate(w, "results.html", data)
		if err != nil {
			panic(err)
		}
}
