const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteButtons = document.querySelectorAll(".deleteBtn");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.className = "video__comment";
    const icon = document.createElement("i");
    icon.className = "fas fa-comment";
    const span = document.createElement("span");
    span.innerText = ` ${text}`;
    const span2 = document.createElement("button");
    span2.className = "deleteBtn";
    span2.addEventListener("click", onClick);
    span2.innerText = "❌";
    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(span2);
    videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") {
        return;
    }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    if (response.status === 201) {
        textarea.value = "";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }
};

const onClick = async (event) => {
    const li = event.target.parentElement;
    const response = await fetch(`/api/comments/${li.dataset.id}`, {
        method: "DELETE",
    });
    if (response.status === 200) {
        li.remove();
    }
};

if (form) {
    form.addEventListener("submit", handleSubmit);
}

Array.from(deleteButtons).forEach(button => button.addEventListener("click", onClick));