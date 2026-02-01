<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Admin Login</title>
    <style>
        body {
            background: #0f0f0f;
            color: #eee;
            font-family: Arial;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        #loginBox {
            background: #151515;
            padding: 30px;
            border: 1px solid #333;
            border-radius: 8px;
            width: 300px;
            text-align: center;
        }

        input {
            width: 100%;
            padding: 10px;
            margin-top: 15px;
            background: #1a1a1a;
            border: 1px solid #333;
            color: #eee;
            border-radius: 4px;
        }

        button {
            width: 100%;
            padding: 10px;
            margin-top: 15px;
            background: #2a2a2a;
            border: 1px solid #444;
            color: #eee;
            cursor: pointer;
            border-radius: 4px;
        }

        button:hover {
            background: #3a3a3a;
        }

        #error {
            color: #f55;
            margin-top: 10px;
            display: none;
        }
    </style>
</head>
<body>

<div id="loginBox">
    <h2>Admin Login</h2>

    <input id="passwordInput" type="password" placeholder="Enter password">
    <button onclick="attemptLogin()">Login</button>

    <div id="error">Incorrect password</div>
</div>

<script>
async function attemptLogin() {
    const password = document.getElementById("passwordInput").value;

    const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
    });

    const data = await res.json();

    if (data.success) {
        localStorage.setItem("adminToken", data.token);
        window.location.href = "/dashboard.html";
    } else {
        document.getElementById("error").style.display = "block";
    }
}
</script>

</body>
</html>
