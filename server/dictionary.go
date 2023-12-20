package main

import (
	"io/ioutil"
	"google.golang.org/protobuf/encoding/prototext"
	"math/rand"
	"strings"
	"time"
)

const dictReleasePath = "./data/dictionary.textproto"

func LoadDictionary() (*Dictionary, error) {
	dictionary := &Dictionary{}
	data, err := ioutil.ReadFile(dictReleasePath)
	if err != nil {
		return dictionary, err
	}

	// Decode the message from the byte array
	err = prototext.Unmarshal(data, dictionary)
	if err != nil {
		return dictionary, err
	}

	return dictionary, nil
}

func (d Dictionary) LookupWord(query string) (*Entry, bool) {
	for _, entry := range d.Entries {
		if *entry.Traditional == query {
			return entry, true
		} else if *entry.Simplified == query {
			return entry, true
		} else if *entry.Pinyin == query {
			return entry, true
		}
	}
	return nil, false
}

// TODO: Make this more efficient
func (d Dictionary) Lookup(query string) []*Entry {
	var entries []*Entry
	for _, entry := range d.Entries {
		if *entry.Traditional == query {
			entries = append(entries, entry)
		} else if *entry.Simplified == query {
			entries = append(entries, entry)
		} else if *entry.Pinyin == query {
			entries = append(entries, entry)
		} else {
			for _, def := range entry.Definitions {
				if strings.Contains(def, query) {
					entries = append(entries, entry)
					break
				}
			}
		}
	}
	return entries
}

// TODO: Pre-index this query!
func (d Dictionary) EntriesWithTag(tagName string) []*Entry {
	var result []*Entry

	for _, entry := range d.Entries {
		for _, entryTagName := range entry.Tags {
			if entryTagName == tagName {
				result = append(result, entry)
				break
			}
		}
	}
	return result
}

func (d Dictionary) GetRandom() *Entry {
	rand.Seed(time.Now().UnixNano())
	return d.Entries[rand.Intn(len(d.Entries))]
}
