# Thoughts

1. We need to parse pdf with a simple parser
2. We need to extract data from html somehow (using html tags?)

Step one would be to create a nestjs application
Step two write some code to clean and extract text from pdf and html
Step three send it off to chatgpt (we will use openai) and get metadata (here we
need to do some research)
Step four create fetch endpoint first by id, but later by something else
    - use AI for this querying possibly
jtep five add persistent storage

# Next steps
Write out the design considerations when it comes to:

* Parsing (what other steps could be taken?)
* Error handling
* Testing
* How migrations would be handled
* Semantic search (maybe just based on the summary, with all the metadata??)
* Security considerations (how to protect the data and the endpoints, and dodgy
  data)

