# Notemaker App

## It's a notes maker app with the help of AI you can also analyse your notes 

- [x] Create the next app and installation - pnpm create-next-app@latest notemaker
- [x] Added the Next theme providers
- [x] Creating Header using shadcn UI (Button and DarkMode toggler)
- [x] Creating Signup and Login Pages UI
- [x] Middleware added
- [x] Adding basic functionality to the login and signup
- [x] Sending emails and Confirming them by using SMTP of Supabase
- [x] Adding the functionality to logout button 
- [x] Prisma SetUp
- [x] Connecting to supabase DB and making interaction with DB
- [x] Adding Core functionality 
- [x] Middleware Setup
- [x] Deployment
- [x] Deployment error resolved



## UI Libraries used 
 1. Button
 2. Card
 3. Dropdown Menu
 4. Input
 5. Label
 6. Sonner for toast

## Components used
  1. Authform - Sign-Up and Login Form and Handle Submit functionality
    - For the forms used the CardContent, Input and Label UI components  
  2. DarkModeTogggler
    - Simple dropdown to toggle between Light dark and System mode
  3. Header 
    - Has logo, Signup/Login button and  DarkMode toggle
  4. LogOutButton - Simple Logout functionality

  5. App Sidebar 
    - To add the list of notes.(like chatgpt sidebar)
  6. Logout button 
    - To logout (include toasts and loading icons)
  7. Sidebar Group content 
    - To include all sidebar contents
  8. Selected bar menu button
    - It shows the content of the selected menu or note
  9. Note Text Input component
    - It is a textarea that used to take input texts and it update the notes in real time
  10. New Note button 
    - It creates the new notes(Prisma) 
  11. AskAI button
    -
  12. DeleteNote Button 
    - To delete the note (in sidebar)

## Backend Server
  1. Auth -> server.ts 
    - Added the functions 
        - createClient() - To create the user instance
        - getUser() - To get the user details 

  ### Prisma Commands
  - pnpm add prisma tsx --save-dev
  - pnpm @prisma/extension-accelerate @prisma/client
  - npx prisma init --db --output ../app/generated/prisma
  - npx prisma studio
  - npx install prisma --save-dev
  - pnpm migrate  
  - pnpm migrate  or pnpm dlx prisma generate && pnpm dlx prisma migrate dev