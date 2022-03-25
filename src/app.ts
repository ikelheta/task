import { EmployeeConteoller } from './controller/employee';
import express from "express"
import 'dotenv/config'
import { connect } from "mongoose"
import { take } from 'rxjs';
import { EmployeerController } from './controller/employeer';
import { JobsController } from './controller/jobs';
import { isTokenValid } from './middleware/authontication';
import { LoginController } from './controller/login';
import { SearchController } from './controller/search';
const cors = require("cors")
const app = express()
app.use(express.json());
app.use(cors())







// ---------------------------------------------------------Employee API---------------------------------------------------------------------

app.post("/employee/register", (req, res) => {
  const p = EmployeeConteoller.addEmployee(req.body).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(500)
      }
    }
  )
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/employee/:id", isTokenValid, (req, res) => {
  const addViewr = req.params.id !== req.user.id && req.user.id
  const p = EmployeeConteoller.findEmployee(req.params.id, addViewr).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(404)
      }
    }
  )
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get('/employee/all/:pn', isTokenValid, (req, res) => {
  const p = EmployeeConteoller.getAllEmployeesPg(Number(req.params.pn)).pipe(take(1)).subscribe({
    next(r) {
      res.send(r)
    },
    error(e) {
      res.sendStatus(500)
    }
  })
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------


// ---------------------------------------------------------Employeer API---------------------------------------------------------------------
app.get("/employeer/all/:pn", isTokenValid, (req, res) => {
  EmployeerController
  const p = EmployeerController.getAllEmployeer(Number(req.params.pn)).pipe(take(1)).subscribe({
    next(r) {
      res.send(r)
    },
    error(e) {
      res.sendStatus(500)
    }
  })
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/employeer/:id", isTokenValid, (req, res) => {

  const p = EmployeerController.getEmployeer(req.params.id).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(404)
      }
    }
  )
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/employeer/register", (req, res) => {
  const p = EmployeerController.addEmployeer(req.body).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(500)
      }
    }
  )
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------jobs Api-------------------------------------------------------------------------
app.post("/jobs/post", isTokenValid, (req, res) => {
  if (req.user.type === "employeer") {
    const p = JobsController.postJob(req.body, req.user.id).pipe(take(1)).subscribe(
      {
        next(r) {
          res.send(r)
        },
        error(e) {
          console.log(e)
          res.sendStatus(500)
        }
      }
    )
  } else {
    res.sendStatus(403)
  }
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/jobs/apply/:jobid", isTokenValid, (req, res) => {

  if (req.user.type === "employee") {
    const p = JobsController.applyForJob(req.params.jobid, req.user.id).pipe(take(1)).subscribe(
      {
        next(r) {
          res.send(r)
        },
        error(e) {
          res.sendStatus(500)
        }
      }
    )
  } else {
    res.sendStatus(403)
  }
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/jobs/user/:jobid", isTokenValid, (req, res) => {
  const p = JobsController.getJobForUser(req.params.jobid).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(500)
      }
    }
  )
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/jobs/myjob/:jobid", isTokenValid, (req, res) => {
  const p = JobsController.getJobForEmployeer(req.params.jobid, req.user.id).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(404)
      }
    }
  )
})

//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/jobs/myjob/all/:pn", isTokenValid, (req, res) => {
  const p = JobsController.getAllJobForEmployeer(Number(req.params.pn), req.user.id).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(404)
      }
    }
  )
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/jobs/all/:pn", (req, res) => {
  const p = JobsController.getAllJobs(Number(req.params.pn)).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(500)
      }
    }
  )
})

//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/jobs/myjob/accept/:jobID/:employeeid", isTokenValid, (req, res) => {

  const p = JobsController.acceptEmployee(req.params.jobID, req.params.employeeid, req.user.id).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(404)
      }
    }
  )
})



//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.post("/jobs/myjob/reject/:jobID/:employeeid", isTokenValid, (req, res) => {
  if (req.params.jobID === req.user.id) {
    const p = JobsController.rejectEmployee(req.params.jobID, req.params.employeeid, req.user.id).pipe(take(1)).subscribe(
      {
        next(r) {
          res.send(r)
        },
        error(e) {
          res.sendStatus(500)
        }
      }
    )
  } else {
    res.sendStatus(403)
  }
})

//--------------------------------------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------LogIn----------------------------------------------------------------------------
app.post("/login/employee", (req, res) => {
  const p = LoginController.employeeLogin(req.body).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(401)
      }
    }
  )
})
// ---------------------------------------------------------LogIn----------------------------------------------------------------------------
app.post("/login/employeer", (req, res) => {
  const p = LoginController.employeerLogin(req.body).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(401)
      }
    }
  )
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/search/jobs", (req, res) => {
  const p = SearchController.searchJob(req.query).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(404)
      }
    }
  )
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/search/employee/:pn", (req, res) => {
  const p = SearchController.searchEmployee(req.query, Number(req.params.pn)).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(404)
      }
    }
  )
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/search/employee/bio", (req, res) => {
  console.log("first")
  const p = SearchController.similarity(req.query).pipe(take(1)).subscribe(
    {
      next(r) {
        res.send(r)
      },
      error(e) {
        res.sendStatus(500)
      }
    }
  )
})
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------------------------------


const PORT = process.env.PORT || 3000

const start = async (): Promise<void> => {
  try {
    await connect(process.env.MONGO_URI || "")
    app.listen(PORT, () => {
      console.log("Server started on port 3000");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();