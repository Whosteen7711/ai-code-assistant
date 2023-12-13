# AI Chatbot tutorial from CodeInFlow channel on Youtube

## Status

3:40:24 finish formatting of chat box
TODO: add AI Chat button to diaglog modal for snippet

## Notes

1. **Pick** is a typescript utility type that wraps props type to override required fields

- enables auto-completion instead of defining separate props

### Dependencies

1. openai: for api access
2. ai: vercel sdk for ai utilities such as response streaming
3. prisma, @prisma/client: typescript ORM and client
4. @pinecone-database/pinecone: vector store for text embeddings
5. @clerk/nextjs: authentication

- configure hostname **img.clerk.com** in **next.config.js** for user profile image

- create app
  social providers require an app in production. Clerk provides app in development
  customization includes user data, and uploading a logo
- add keys
- wrap app in **Clerk Provider** to access user context from anywhere
- add **middleware.ts** to require authentication for access and make homepage public
- add catch-all route to redirect to sign-in/sign-up pages when user has not authenticated
- update env variables

6. shadcn: UI components

- components.json: config file for components
- tailwind.config.js: tailwind config file
- globals.css: add color vars
- package.json: installed packages for styling and icons
- utils.ts: dynamically combine tailwind classes
- button components don't have a loading state prop
- extend button component with **& ButtonProps** after type declaration

7. MongoDB: store text

- Create new project/cluster
- add user and connection
- set up prisma
  npx prisma init
- ignore **.env**
- install **mongodb** package
- update database url with password
- add database name after **.net/**
- add schema model
- generate prisma client: **npx prisma generate**
  any schema change requires prisma client to be regenerated

8. OpenAI Pinecone setup

- add openai api key as env var
- create account on pinecone to use db for vector storage
- create and index for vector embeddings
  - configure index:
    - dimensions: model output => OpenAI 2nd gen model for text embeddings requires 1536 output dimensions
      - **text-embedding-ada-002**
- add pinecone api key as env var
- add files to export instances of openai and pincone api packages

9.  Vecel AI SDK

- manage chat messages with useChat hook
  - manages form validation so can use primitive form element
  - useChat by default will send request to backend api route: **/api/chat**
  - create /api/chat route
- supports response streaming

### Components

1. Navbar

- should only render snippets routes
  - layout.tsx: center page elements **m-auto**, restrict width of page elements **max-w-7xl**

2. AI Chatbot

- vercel sdk:
  - use vector embedding to search for relevant content
  - send to OpenAI API for response from ChatGPT
