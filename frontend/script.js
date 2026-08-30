/* =====================================================
   BLOGSPHERE FRONTEND
   Connected to a real backend API (Express + MongoDB)
   instead of a hardcoded array. Posts you create now
   persist for real.
===================================================== */


/* =====================================================
   CONFIG
===================================================== */

// Change this if your backend runs somewhere else
const API_BASE_URL = "http://localhost:5000/api";


/* =====================================================
   STATE
===================================================== */

let posts = [];
let currentCategory = "All";


/* =====================================================
   DOM ELEMENTS
===================================================== */

const blogContainer = document.getElementById("blogContainer");
const noResults = document.getElementById("noResults");
const searchInput = document.getElementById("searchInput");
const postForm = document.getElementById("postForm");
const postModal = document.getElementById("postModal");
const blogModal = document.getElementById("blogModal");


/* =====================================================
   PAGE INITIALIZATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadPosts();

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

});


/* =====================================================
   API HELPER
===================================================== */

async function apiRequest(path, options = {}) {

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong. Please try again.");
    }

    return data;

}


/* =====================================================
   LOAD POSTS FROM BACKEND
===================================================== */

async function loadPosts() {

    try {

        posts = await apiRequest("/posts");

        renderPosts(posts);

        updatePostCount();

    } catch (err) {

        blogContainer.innerHTML = `
            <p style="grid-column: 1 / -1; text-align:center; color:#b91c1c;">
                Could not load posts. Is the backend server running at ${API_BASE_URL}?
                <br>(${escapeHTML(err.message)})
            </p>
        `;

    }

}


/* =====================================================
   RENDER POSTS
===================================================== */

function renderPosts(postList) {

    blogContainer.innerHTML = "";

    if (postList.length === 0) {

        noResults.classList.remove("hidden");

        return;

    }

    noResults.classList.add("hidden");


    postList.forEach(function (post) {

        const card = document.createElement("article");

        card.className = "blog-card";


        const shortContent =
            post.content.length > 115
                ? post.content.substring(0, 115) + "..."
                : post.content;


        card.innerHTML = `

            <div class="blog-image-container">

                <img
                    src="${post.image || getDefaultImage()}"
                    alt="${escapeHTML(post.title)}"
                    class="blog-image"
                    onerror="this.src='${getDefaultImage()}'"
                >

            </div>

            <div class="blog-info">

                <span class="blog-category">
                    ${escapeHTML(post.category)}
                </span>

                <h3 class="blog-title">
                    ${escapeHTML(post.title)}
                </h3>

                <p class="blog-excerpt">
                    ${escapeHTML(shortContent)}
                </p>

                <div class="blog-meta">

                    <span>
                        ✍️ ${escapeHTML(post.author)}
                    </span>

                    <button
                        class="read-more"
                        onclick="openBlogDetails('${post._id}')">
                        Read More →
                    </button>

                </div>

            </div>

        `;


        blogContainer.appendChild(card);

    });

}


/* =====================================================
   SEARCH + CATEGORY FILTER
   (sent to the backend as query params)
===================================================== */

async function searchPosts() {

    const searchTerm = searchInput.value.trim();

    const params = new URLSearchParams();

    if (currentCategory && currentCategory !== "All") {
        params.set("category", currentCategory);
    }

    if (searchTerm) {
        params.set("search", searchTerm);
    }

    try {

        const filtered = await apiRequest(`/posts?${params.toString()}`);

        renderPosts(filtered);

    } catch (err) {

        alert(err.message);

    }

}

searchInput.addEventListener("input", function () {

    searchPosts();

});


function filterPosts(category, button) {

    currentCategory = category;

    document
        .querySelectorAll(".category-btn")
        .forEach(function (btn) {
            btn.classList.remove("active");
        });

    button.classList.add("active");

    searchPosts();

}


/* =====================================================
   CREATE POST MODAL
===================================================== */

function openCreatePost() {

    postModal.classList.add("show");
    document.body.style.overflow = "hidden";

}


function closeCreatePost() {

    postModal.classList.remove("show");
    document.body.style.overflow = "";

}


/* =====================================================
   CREATE NEW POST (sends to backend)
===================================================== */

postForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const title = document.getElementById("postTitle").value.trim();
    const author = document.getElementById("postAuthor").value.trim();
    const category = document.getElementById("postCategory").value;
    const image = document.getElementById("postImage").value.trim();
    const content = document.getElementById("postContent").value.trim();

    if (!title || !author || !category || !content) {
        alert("Please fill all required fields.");
        return;
    }

    try {

        await apiRequest("/posts", {
            method: "POST",
            body: JSON.stringify({ title, author, category, image, content })
        });

        postForm.reset();
        closeCreatePost();

        currentCategory = "All";

        document
            .querySelectorAll(".category-btn")
            .forEach(function (btn) {
                btn.classList.remove("active");
            });

        document.querySelector(".category-btn").classList.add("active");

        searchInput.value = "";

        await loadPosts();

        alert("Your blog has been published successfully!");

    } catch (err) {

        alert(err.message);

    }

});


/* =====================================================
   OPEN BLOG DETAILS
===================================================== */

function openBlogDetails(postId) {

    const post = posts.find(function (item) {
        return item._id === postId;
    });

    if (!post) {
        return;
    }

    document.getElementById("detailImage").src = post.image || getDefaultImage();

    document.getElementById("detailImage").onerror = function () {
        this.src = getDefaultImage();
    };

    document.getElementById("detailCategory").textContent = post.category;
    document.getElementById("detailTitle").textContent = post.title;
    document.getElementById("detailAuthor").textContent = post.author;
    document.getElementById("detailDate").textContent = formatDate(new Date(post.createdAt));
    document.getElementById("detailText").textContent = post.content;

    blogModal.classList.add("show");
    document.body.style.overflow = "hidden";

}


/* =====================================================
   CLOSE BLOG DETAILS
===================================================== */

function closeBlogDetails() {

    blogModal.classList.remove("show");
    document.body.style.overflow = "";

}


/* =====================================================
   UPDATE POST COUNT
===================================================== */

function updatePostCount() {

    document.getElementById("heroPostCount").textContent = posts.length;

}


/* =====================================================
   DEFAULT IMAGE
===================================================== */

function getDefaultImage() {

    return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80";

}


/* =====================================================
   DATE FORMATTER
===================================================== */

function formatDate(date) {

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    });

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(value) {

    const div = document.createElement("div");
    div.textContent = value;
    return div.innerHTML;

}


/* =====================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
===================================================== */

window.addEventListener("click", function (event) {

    if (event.target === postModal) {
        closeCreatePost();
    }

    if (event.target === blogModal) {
        closeBlogDetails();
    }

});


/* =====================================================
   ESC KEY CLOSES MODALS
===================================================== */

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeCreatePost();
        closeBlogDetails();
    }

});
