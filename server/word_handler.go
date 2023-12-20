package main

import (
	"fmt"
	"net/http"
	"strings"
)

func wordHandler(w http.ResponseWriter, r *http.Request) {
	urlPath := r.URL.Path
	segments := strings.Split(urlPath, "/")
	word := segments[len(segments)-1]

	entry, found := globalDict.LookupWord(word)
	if !found {
		fmt.Fprintf(w, "No entries found.")
		return
	}

	parts := strings.Split(*entry.Pinyin, " ")
	var characters []*Character
	for _, part := range parts {
		newPart := part
		characters = append(characters, &Character{
			Pinyin: &newPart,
		})
	}

	simpParts := strings.Split(*entry.Simplified, "")
	for i, part := range simpParts {
		newPart := part
		characters[i].Simplified = &newPart
	}

	data := struct {
		Word       *Entry
		HeaderData HeaderData
		Characters []*Character
	}{
		Word:       entry,
		HeaderData: HeaderData{Subtitle: *entry.Simplified},
		Characters: characters,
	}

	err := wordTemplate.ExecuteTemplate(w, "word.html", data)
	if err != nil {
		panic(err)
	}
}
