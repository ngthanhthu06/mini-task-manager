
/* 1. Mảng chứa 5 công việc mẫu */
let tasks = [
    {
        id: 1,
        name: "Xem  HTML",
        date: "2026-10-14",
        priority: "Cao",
        completed: false
    },
    {
        id: 2,
        name: "Ôn tập CSS",
        date: "2026-10-15",
        priority: "Trung bình",
        completed: false
    },
    {
        id: 3,
        name: "Làm bài JavaScript",
        date: "2026-10-16",
        priority: "Cao",
        completed: false
    },
    {
        id: 4,
        name: "Đọc tài liệu",
        date: "2026-10-17",
        priority: "Thấp",
        completed: true
    },
    {
        id: 5,
        name: "Nộp bài thực hành",
        date: "2026-10-18",
        priority: "Cao",
        completed: false
    }
];

/* 2. Lấy các phần tử HTML */
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskDate = document.getElementById("taskDate");
const taskPriority = document.getElementById("taskPriority");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

/* 3. Hiển thị danh sách công việc */
function renderTasks() {
    const keyword = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;

    // Tìm kiếm theo tên và lọc trạng thái
    const filteredTasks = tasks.filter(function(task) {
        const matchName = task.name.toLowerCase().includes(keyword);

        const matchStatus =
            status === "all" ||
            (status === "active" && !task.completed) ||
            (status === "completed" && task.completed);

        return matchName && matchStatus;
    });

    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "Không tìm thấy công việc phù hợp.";
        emptyMessage.style.color = "#718096";
        emptyMessage.style.textAlign = "center";
        emptyMessage.style.padding = "20px";
        taskList.appendChild(emptyMessage);
    }

    filteredTasks.forEach(function(task) {
        const item = document.createElement("div");
        item.className = "task-item";

        if (task.completed) {
            item.classList.add("completed");
        }

        let priorityClass = "priority-medium";

        if (task.priority === "Cao") {
            priorityClass = "priority-high";
        } else if (task.priority === "Thấp") {
            priorityClass = "priority-low";
        }

        const dateText = task.date
            ? new Date(task.date + "T00:00:00").toLocaleDateString("vi-VN")
            : "Chưa đặt hạn";

        // Thông tin công việc
        const info = document.createElement("div");
        info.className = "task-info";

        const title = document.createElement("h3");
        title.textContent = task.name;

        const detail = document.createElement("p");
        detail.appendChild(
            document.createTextNode("Hạn: " + dateText + " | Ưu tiên: ")
        );

        const priority = document.createElement("span");
        priority.className = priorityClass;
        priority.textContent = task.priority;

        detail.appendChild(priority);
        info.append(title, detail);

        // Các nút thao tác
        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeBtn = document.createElement("button");
        completeBtn.type = "button";
        completeBtn.dataset.action = "toggle";
        completeBtn.dataset.id = task.id;
        completeBtn.textContent = task.completed
            ? "Hoàn tác"
            : "Hoàn thành";

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.dataset.action = "delete";
        deleteBtn.dataset.id = task.id;
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Xóa";

        actions.append(completeBtn, deleteBtn);
        item.append(info, actions);
        taskList.appendChild(item);
    });

    // Thống kê công việc
    const completedCount = tasks.filter(function(task) {
        return task.completed;
    }).length;

    taskCount.textContent =
        "Hiển thị " + filteredTasks.length + "/" + tasks.length +
        " công việc | Đã hoàn thành: " + completedCount;
}

/* 4. Thêm công việc */
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = taskName.value.trim();

    if (name === "") {
        alert("Vui lòng nhập tên công việc!");
        taskName.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        name: name,
        date: taskDate.value,
        priority: taskPriority.value,
        completed: false
    };

    tasks.push(newTask);

    // Xóa nội dung form
    taskForm.reset();

    // Hiện công việc mới ngay cả khi đang tìm kiếm hoặc lọc
    statusFilter.value = "all";
    searchInput.value = "";

    renderTasks();
});

/* 5. Tìm kiếm không phân biệt hoa thường */
searchInput.addEventListener("input", function() {
    renderTasks();
});

/* 6. Lọc theo trạng thái */
statusFilter.addEventListener("change", function() {
    renderTasks();
});

/* 7. Đánh dấu hoàn thành và xóa công việc */
taskList.addEventListener("click", function(event) {
    const button = event.target.closest("button");

    if (!button || !taskList.contains(button)) {
        return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "toggle") {
        tasks = tasks.map(function(task) {
            if (task.id === id) {
                return {
                    ...task,
                    completed: !task.completed
                };
            }

            return task;
        });
    } else if (action === "delete") {
        const confirmed = confirm(
            "Bạn có chắc muốn xóa công việc này?"
        );

        if (!confirmed) {
            return;
        }

        tasks = tasks.filter(function(task) {
            return task.id !== id;
        });
    }

    renderTasks();
});

/* 8. Hiển thị danh sách khi mở trang */
renderTasks();
