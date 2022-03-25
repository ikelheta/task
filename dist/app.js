"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const employee_1 = require("./controller/employee");
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const mongoose_1 = require("mongoose");
const rxjs_1 = require("rxjs");
const employeer_1 = require("./controller/employeer");
const jobs_1 = require("./controller/jobs");
const authontication_1 = require("./middleware/authontication");
const login_1 = require("./controller/login");
const search_1 = require("./controller/search");
const cors = require("cors");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
// ---------------------------------------------------------Employee API---------------------------------------------------------------------
app.post("/employee/register", (req, res) => {
    const p = employee_1.EmployeeConteoller.addEmployee(req.body).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(500);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/employee/:id", authontication_1.isTokenValid, (req, res) => {
    const addViewr = req.params.id !== req.user.id && req.user.id;
    const p = employee_1.EmployeeConteoller.findEmployee(req.params.id, addViewr).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(404);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/employee/all/:pn', authontication_1.isTokenValid, (req, res) => {
    const p = employee_1.EmployeeConteoller.getAllEmployeesPg(Number(req.params.pn)).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(500);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------Employeer API---------------------------------------------------------------------
app.get("/employeer/all/:pn", authontication_1.isTokenValid, (req, res) => {
    employeer_1.EmployeerController;
    const p = employeer_1.EmployeerController.getAllEmployeer(Number(req.params.pn)).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(500);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/employeer/:id", authontication_1.isTokenValid, (req, res) => {
    const p = employeer_1.EmployeerController.getEmployeer(req.params.id).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(404);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/employeer/register", (req, res) => {
    const p = employeer_1.EmployeerController.addEmployeer(req.body).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(500);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------jobs Api-------------------------------------------------------------------------
app.post("/jobs/post", authontication_1.isTokenValid, (req, res) => {
    if (req.user.type === "employeer") {
        const p = jobs_1.JobsController.postJob(req.body, req.user.id).pipe((0, rxjs_1.take)(1)).subscribe({
            next(r) {
                res.send(r);
            },
            error(e) {
                console.log(e);
                res.sendStatus(500);
            }
        });
    }
    else {
        res.sendStatus(403);
    }
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/jobs/apply/:jobid", authontication_1.isTokenValid, (req, res) => {
    if (req.user.type === "employee") {
        const p = jobs_1.JobsController.applyForJob(req.params.jobid, req.user.id).pipe((0, rxjs_1.take)(1)).subscribe({
            next(r) {
                res.send(r);
            },
            error(e) {
                res.sendStatus(500);
            }
        });
    }
    else {
        res.sendStatus(403);
    }
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/jobs/user/:jobid", authontication_1.isTokenValid, (req, res) => {
    const p = jobs_1.JobsController.getJobForUser(req.params.jobid).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(500);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/jobs/myjob/:jobid", authontication_1.isTokenValid, (req, res) => {
    const p = jobs_1.JobsController.getJobForEmployeer(req.params.jobid, req.user.id).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(404);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/jobs/myjob/all/:pn", authontication_1.isTokenValid, (req, res) => {
    const p = jobs_1.JobsController.getAllJobForEmployeer(Number(req.params.pn), req.user.id).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(404);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/jobs/all/:pn", (req, res) => {
    const p = jobs_1.JobsController.getAllJobs(Number(req.params.pn)).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(500);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/jobs/myjob/accept/:jobID/:employeeid", authontication_1.isTokenValid, (req, res) => {
    const p = jobs_1.JobsController.acceptEmployee(req.params.jobID, req.params.employeeid, req.user.id).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(404);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/jobs/myjob/reject/:jobID/:employeeid", authontication_1.isTokenValid, (req, res) => {
    if (req.params.jobID === req.user.id) {
        const p = jobs_1.JobsController.rejectEmployee(req.params.jobID, req.params.employeeid, req.user.id).pipe((0, rxjs_1.take)(1)).subscribe({
            next(r) {
                res.send(r);
            },
            error(e) {
                res.sendStatus(500);
            }
        });
    }
    else {
        res.sendStatus(403);
    }
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------LogIn----------------------------------------------------------------------------
app.post("/login/employee", (req, res) => {
    const p = login_1.LoginController.employeeLogin(req.body).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(401);
        }
    });
});
// ---------------------------------------------------------LogIn----------------------------------------------------------------------------
app.post("/login/employeer", (req, res) => {
    const p = login_1.LoginController.employeerLogin(req.body).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(401);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/search/jobs", (req, res) => {
    const p = search_1.SearchController.searchJob(req.query).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(404);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/search/employee/:pn", (req, res) => {
    const p = search_1.SearchController.searchEmployee(req.query, Number(req.params.pn)).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(404);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/search/employee/bio", (req, res) => {
    console.log("first");
    const p = search_1.SearchController.similarity(req.query).pipe((0, rxjs_1.take)(1)).subscribe({
        next(r) {
            res.send(r);
        },
        error(e) {
            res.sendStatus(500);
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connect)(process.env.MONGO_URI || "");
        app.listen(PORT, () => {
            console.log("Server started on port 3000");
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
void start();
