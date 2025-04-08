## Contributing to the IT Society Timeline

Thank you for your interest in contributing to the IT Society Timeline project! This guide will help committee members add a new JSON file for a specific year to the timeline. If the year you wish to add does not exist, please follow the steps below to create and submit your contribution.

### 
🛠 How Committee Members Can Contribute a New Year

If your committee year is not yet represented in the timeline, you can add it by submitting a pull request. Here’s how:
1. Fork the Repository
Go to IT_Soc_Timeline and click Fork in the top-right corner to create your own copy.
2. Clone Your Fork

Open your terminal and run:
```
git clone https://github.com/micfun123/IT_Soc_Timeline.git
cd IT_Soc_Timeline
```
3. Create a JSON File

Inside the `/data` folder, create a new file named after your committee year. For example:
```
/data/2025-2026.json
```

4. Add Your Committee Information
```
Use the following format:

{
  "year": "2025-2026",
  "current": true,
  "members": [
    {
      "name": "Your Name",
      "role": "Your Role",
      "bio": "Short bio",
      "links": [
        {"platform": "linkedin", "username": "your-linkedin"},
        {"platform": "github", "username": "your-github"},
        {"platform": "website", "username": "your-website"},
        {"platform": "email", "username": "your@email.com"}
      ],
      "type": "executive"
    }
    // add more members as needed
  ]
}
```
5. Commit and Push
```
git checkout -b add-2025-2026
git add data/2025-2026.json
git commit -m "Add committee data for 2025-2026"
git push origin add-2025-2026
```
6. Open a Pull Request

Visit your fork on GitHub, and click Compare & pull request. Add a short description and submit!



### ✅ Supported Link Platforms:

Supported Platforms for Member Links

The website supports the following platforms for member links:​

LinkedIn: `https://linkedin.com/in/{username}​`
    Example: `{"platform": "linkedin", "username": "john-doe"}​`
GitHub: `https://github.com/{username}​`
    Example: `{"platform": "github", "username": "johndoe"}​`
Website: https://{username}​`
    Example: `{"platform": "website", "username": "www.johndoe.com"}​`
Twitter: `https://twitter.com/{username}​`
    Example: `{"platform": "twitter", "username": "johndoe"}​`
Instagram: `https://instagram.com/{username}​`
    Example: `{"platform": "instagram", "username": "johndoe"}​`
Mastodon: `https://mastodon.social/@{username}​`
    Example: `{"platform": "mastodon", "username": "johndoe"}​`
Email: `mailto:{username}​`
    Example: `{"platform": "email", "username": "johndoe@example.com"}​`
YouTube: `https://youtube.com/{username}​`
    Example: `{"platform": "youtube", "username": "johndoe"}​`
If you don't have any links, use an empty list: "links": []

