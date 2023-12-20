package main

import (
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"strings"
)

var wordTemplate *template.Template
var globalDict *Dictionary

type HeaderData struct {
	Subtitle string
}

// TODO: Replace panics with returning a 500 page.

// index.html should be routed as a static file.

func main() {
	log.Print("Loading data...")
	wordTemplate = initTemplates()

	dictionary, err := LoadDictionary()
	globalDict = dictionary
	if err != nil {
		log.Fatal(err)
	}
	// fmt.Printf("%+v\n", globalDict.Entries)

	log.Print("Starting server...")
	mux := http.NewServeMux()
	mux.HandleFunc("/word/", wordHandler)
	mux.HandleFunc("/tag/", tagHandler)
	mux.HandleFunc("/results", resultsHandler)
	mux.HandleFunc("/about", aboutHandler)
	mux.HandleFunc("/random", randomHandler)
	mux.HandleFunc("/", indexHandler)

	port := getPort()
	log.Printf("listening on port %s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}

func initTemplates() *template.Template {
	// Parse the templates
	wordTemplate, err := template.ParseGlob("./server/templates/*")
	if err != nil {
		log.Fatal("Failed to parse templates:", err)
	}
	return wordTemplate
}

func getPort() string {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("defaulting to port %s", port)
	}
	return port
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	err := wordTemplate.ExecuteTemplate(w, "index.html", nil)
	if err != nil {
		panic(err)
	}
}

func aboutHandler(w http.ResponseWriter, r *http.Request) {
	err := wordTemplate.ExecuteTemplate(w, "about.html", nil)
	if err != nil {
		panic(err)
	}
}

func randomHandler(w http.ResponseWriter, r *http.Request) {
	entry := globalDict.GetRandom()
	url := fmt.Sprintf("/word/%s", *entry.Simplified)
	http.Redirect(w, r, url, http.StatusFound)
}

func tagHandler(w http.ResponseWriter, r *http.Request) {
	urlPath := r.URL.Path
	segments := strings.Split(urlPath, "/")
	tagName := segments[len(segments)-1]

	entries := globalDict.EntriesWithTag(tagName)[:200]
	if len(entries) == 0 {
		fmt.Fprintf(w, "No entries found.")
		return
	}
	// fmt.Printf("Found: %+v\n", entry)

	data := struct {
		Entries    []*Entry
		HeaderData HeaderData
		TagName    string
	}{
		Entries:    entries,
		HeaderData: HeaderData{Subtitle: tagName},
		TagName:    tagName,
	}

	err := wordTemplate.ExecuteTemplate(w, "tag.html", data)
	if err != nil {
		panic(err)
	}
}
