# Thoughts

1. We need to parse pdf with a simple parser
2. We need to extract data from html somehow (using html tags?)

Step one would be to create a nestjs application
Step two write some code to clean and extract text from pdf and html
Step three send it off to chatgpt (we will use openai) and get metadata (here we
need to do some research)

The above is now done

TODO:
Step four create fetch endpoint first by id, but later by something else
    - use AI for this querying possibly
Step five add persistent storage



We’d like you to build a NestJS application that can parse meta data from an HTML or PDF document about a given case law. The application should perform this extraction using any publicly available LLM (i.e. OpenAI, Claude etc.) of your choice. We have provided two documents that your application should be able to parse:
https://drive.google.com/file/d/1DDJl999zmBC2MGR7L2AdP-r_Obk3Q64g/view?usp=sharing
https://drive.google.com/file/d/1Y_ySBDcRJqvlqcIBmog2wJMaPoe9ymke/view?usp=sharing

Requirements
Extraction Endpoint
One endpoint that accepts the file
This should extract data from the file and persist to a local database.
The following data must be extracted:
    title
    decision type
    date of decision
    office
    court
    case number
    a summary of the case and its conclusion

If you need additional context, here are the sources of the documents we’ve provided for parsing:

HTML: https://mfkn.naevneneshus.dk/afgoerelse/9d2a285b-aef1-4399-b157-a9e00972a152?highlight=



PDF: https://curia.europa.eu/juris/document/document.jsf?docid=297808&mode=req&pageIndex=1&dir=&occ=first&part=1&text=&doclang=EN&cid=7746690



Fetch Endpoint

One endpoint to retrieve a specific case law resource (e.g., by ID or some identifiable field).
Persistent Storage
Include some sort of database solution (e.g., Postgres) and instructions to run it locally—preferably via Docker.
Show us how you structure and manage the data schema and migrations (if applicable).

## Documentation

Provide clear setup instructions.

Describe your key decisions and any notable trade-offs.
Note anything you’d change or add to make the solution production-ready (e.g., tests, security enhancements).

Nice to have

GraphQL

While REST endpoints are perfectly fine, feel free to use GraphQL if you’d like to showcase those skills.

Advanced Querying or Filtering

If your endpoint collects enough data, adding some sort of filtering, sorting, or pagination could demonstrate your approach to data handling.

Submission Guidelines

Provide a link to your repository (GitHub, GitLab, etc.)

A brief README (or docs folder) describing your project structure, decisions made, and next steps for production readiness. Include clear instructions on how to install and run your application.

Optionally, it would be great if you included a link to a video demonstrating your working solution.


We look forward to reviewing your code and learning about your decision-making process.
