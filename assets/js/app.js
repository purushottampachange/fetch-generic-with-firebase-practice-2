

const cl = console.log;

const blogForm = document.getElementById("blogForm");
const title = document.getElementById("title");
const content = document.getElementById("content");
const userId = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const blogContainer = document.getElementById("blogContainer");
const spinner = document.getElementById("spinner");

const baseURL = "https://post-task-xhr-default-rtdb.firebaseio.com/";

const PostURL = "https://post-task-xhr-default-rtdb.firebaseio.com/blogs.json";

const converArr = (obj) => {

    let res = [];

    for (const key in obj) {

        res.unshift({ ...obj[key], id: key });
    }

    return res;
}

const SnackBar = (icon, msg) => {

    Swal.fire({
        icon: icon,
        title: msg,
        timer: 1500
    })
}

const MakeAPICall = (apiURL, method, body) => {

    spinner.classList.remove("d-none");

    body = body ? JSON.stringify(body) : null;

    let configObj = {

        method: method,
        body: body,
        headres: {

            "auth": "token from local storage",
            "content-type": "application/json"
        }
    }

    return fetch(apiURL, configObj)
        .then(res => {
            if (!res.ok) {

                throw new Error("something went wrong");
            } else {

                return res.json();
            }
        })
        .catch(err => {

            SnackBar("error", err);
        })

}


const Templating = (arr) => {

    let res = arr.map(b => {

        return `
        
                  <div class="card mb-4" id="${b.id}">
                        <div class="card-header">
                            <h5>${b.title}</h5>
                        </div>
                        <div class="card-body">
                            <p>${b.content}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                        </div>
                    </div>
          
        `;
    }).join("")

    blogContainer.innerHTML = res;
}

const CreateBlog = (b, id) => {

    let card = document.createElement("div");

    card.id = id;
    card.className = "card mb-4";
    card.innerHTML = `
         
                        <div class="card-header">
                            <h5>${b.title}</h5>
                        </div>
                        <div class="card-body">
                            <p>${b.content}</p>
                        </div>
                        <div class="card-footer d-flex justify-content-between">
                            <button class="btn btn-sm btn-success" onclick = "onEdit(this)">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick = "onRemove(this)">Remove</button>
                        </div>
        
    `;

    blogContainer.prepend(card);
}

const FetchData = () => {

    MakeAPICall(PostURL, "GET", null)
        .then(res => {
            let data = converArr(res);
            cl(data);
            Templating(data);
        })
        .finally(() => {

            spinner.classList.add("d-none");

        })
}

FetchData();

const onSubmit = (eve) => {

    eve.preventDefault();

    let blogObj = {

        title: title.value,
        content: content.value,
        userId: userId.value
    }

    MakeAPICall(PostURL, "POST", blogObj)
        .then(res => CreateBlog(blogObj,res.name))
        .finally(() => spinner.classList.add("d-none"));
}

blogForm.addEventListener("submit", onSubmit);