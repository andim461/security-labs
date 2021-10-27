const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 8080;
const DB_URI = process.env.DB_URI;
console.log(DB_URI);
if (!DB_URI) {
    throw Error("DB_URI is undefined");
}

const app = express();
app.use(express.json());
app.use(cors());

const createAdmin = async () => {

    const existentUser = await User.exists({name: "ADMIN"});
    if(!existentUser){
        await User.create({name: "ADMIN", isAdmin: true});
        console.log("ADMIN created");
    }else{
        console.log("ADMIN exists");
    }
    

}

const extractUserData = user => ({
    id: user.id,
    name: user.name,
    isAdmin: user.isAdmin,
    isBlocked: user.isBlocked,
    isActivated: user.isActivated,
    isPasswordRestricted: user.isPasswordRestricted
});

const isPasswordValid = password => {
    return /(?=.*[0-9])(?=.*[+\/*\-])[0-9a-zA-Z\W]/.test(password);
}

app.post("/signIn", async (req, res) => {
    try {
        if (!req.body.name || typeof req.body.password !== "string") {
            res.status(404).send("Отсутствует логин и/или пароль");
            return;
        }
        let user = await User.find({
            name: req.body.name,
        });
        switch (user.length) {
            case 0:
                res.status(404).send("Пользователь не найден");
                break;
            case 1:
                user = user[0];
                if (user.password === req.body.password) {
                    const extractedUserData = extractUserData(user);
                    res.status(200).json(extractedUserData);
                } else {
                    res.status(404).json("Неверный пароль");
                }
                break;
            default:
                res.status(404).send("Ошибка сервера");
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.post("/addUser", async (req, res) => {
    try {
        if (!req.body.name) {
            res.status(404).send("Тело запроса не содержит имя пользователя или имя является пустой строкой");
            return;
        }
        const existentUser = await User.exists({name: req.body.name});
        if (existentUser) {
            res.status(404).send("Пользователь с таким именем уже существует");
        } else {
            await User.create({name: req.body.name});
            res.status(200).send("OK");
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.post("/activateUser", async (req, res) => {
    try {
        const {id, newPassword} = req.body;
        if (!(id && newPassword)) {
            res.status(404).send("Полученные сервером данные некорректны");
            return;
        }
        const user = await User.findOne({_id: id});
        if (user) {
            if (user.isActivated) {
                res.status(404).send("Пользователь уже активирован")
            } else {
                if (user.isPasswordRestricted && !isPasswordValid(newPassword)) {
                    console.log('не прошло');
                    res.status(404).send("Пароль не проходит валидацию");
                    return;
                }
                await User.updateOne({_id: id}, {isActivated: true, password: newPassword});
                res.status(200).send("OK");
            }
        } else {
            res.status(404).send("Пользователя с полученным id не существует");
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.post("/changePassword", async (req, res) => {
    try {
        const {id, oldPassword, newPassword} = req.body;
        if (!(id && oldPassword && newPassword)) {
            res.status(404).send("Полученные сервером данные некорректны");
            return;
        }
        const user = await User.findOne({_id: id});
        if (user) {
            if (user.password === "") {
                res.status(404).send("Пользователь не активирован");
            }
            if (user.password === oldPassword) {
                if (user.isPasswordRestricted && !isPasswordValid(newPassword)) {
                    res.status(404).send("Пароль не проходит валидацию")
                    return;
                }
                await User.updateOne({_id: id}, {password: newPassword});
                res.status(200).send("OK");
            } else {
                res.status(404).send("Текущий пароль введен неверно");
            }
        } else {
            res.status(404).send("Пользователя с полученным id не существует");
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.post("/toggleBlockUser", async (req, res) => {
    try {
        const {id} = req.body;
        if (!id) {
            res.status(404).send("Тело запроса не содержит id или id является пустой строкой");
            return;
        }
        const user = await User.findOne({_id: id});
        if (user) {
            const isUserBlocked = !!user.isBlocked;
            await User.updateOne({_id: id}, {isBlocked: !isUserBlocked});
            res.status(200).send("OK");
        } else {
            res.status(404).send("Пользователь с указанным id не найден")
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.post("/toggleRestrictedPassword", async (req, res) => {
    try {
        const {id} = req.body;
        if (!id) {
            res.status(404).send("Тело запроса не содержит id или id является пустой строкой");
            return;
        }
        const user = await User.findOne({_id: id});
        if (user) {
            const isPasswordRestricted = user.isPasswordRestricted;
            await User.updateOne({_id: id}, {isPasswordRestricted: !isPasswordRestricted});
            res.status(200).send("OK");
        } else {
            res.status(404).send("Пользователь с указанным id не найден")
        }
    } catch (error) {
        res.status(404).send(error.message);
    }
});

app.get("/getUsers", async (req, res) => {
    try {
        let users = await User.find({name: {$not: {$eq: "ADMIN"}}});
        users = users.map(userData => extractUserData(userData));
        res.status(200).json(users);
    } catch (error) {
        res.status(404).send(error.message);
    }
});


async function start() {
    try {
        await mongoose.connect(
            "mongodb+srv://andim:andim@andimcluster.bu6lx.mongodb.net/users?retryWrites=true&w=majority"
        );
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
        createAdmin();
    } catch (error) {
        console.error(error);
    }
}

start();
