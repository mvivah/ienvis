const THISDAY = new Date();
const THISMONTH = THISDAY.getMonth();
const THISYEAR = THISDAY.getFullYear();
const GET_DAY_NAME = dt => {
  const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  return DAYS[dt.getDay()];
};

const GET_MONTH_NAME = dt => {
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return MONTHS[dt.getMonth()];
};

let FIELD_IDS = [];
let ERROR_COUNT = 0;
let viewButtons = (editButtons = deleteButtons = station = "");

// Form reset
document.querySelectorAll(".reseter").forEach(element => {
  element.addEventListener("click", function() {
    const parent_form = this.parentNode.parentNode.id;
    document.getElementById(parent_form).reset();
  });
});

//Homes
try {
  document.getElementById("homeForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let HOME_INDEX = document.getElementById("home_id");
    let HOME_ID = HOME_INDEX === null ? null : HOME_INDEX.value;
    FIELD_IDS = [
      "home_name",
      "home_type",
      "home_head",
      "home_address",
      "adults",
      "minors",
      "clan",
      "totem",
      "religion"
    ];
    let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
    if (emptyFields === 0) {
      let formData = new FormData(this);
      if (HOME_ID !== null && HOME_ID != "") {
        axios
          .post(`/homes/${HOME_ID}`, formData, {
            method: "PUT"
          })
          .then(response => {
            $("#homeForm")[0].reset();
            $("#addHome").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      } else {
        axios
          .post("/homes", formData)
          .then(response => {
            $("#homeForm")[0].reset();
            $("#addHome").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    }
  });

  document.getElementById("house_owned").addEventListener("click", function(e) {
    document.getElementById("rent").style.display = "none";
  });

  document
    .getElementById("house_rented")
    .addEventListener("click", function(e) {
      document.getElementById("rent").style.display = "block";
    });

  document
    .getElementById("process_pageone")
    .addEventListener("click", function(e) {
      e.preventDefault();
      FIELD_IDS = [
        "total_rooms",
        "home_layout",
        "journey_home",
        "home_closeness",
        "clean_water",
        "family_kitchen",
        "family_income"
      ];
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);

      if (emptyFields === 0) {
        document.getElementById("pagetwo").style.display = "block";
        document.getElementById("back_to_pageone").style.display = "block";
        document.getElementById("save_assessment").style.display = "block";
        document.getElementById("pageone").style.display = "none";
        document.getElementById("process_pageone").style.display = "none";
      } else {
        console.log(emptyFields);
      }
    });

  document.getElementById("back_to_pageone").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("pagetwo").style.display = "none";
    document.getElementById("pageone").style.display = "block";
    document.getElementById("process_pageone").style.display = "block";
    document.getElementById("save_assessment").style.display = "none";
    document.getElementById("back_to_pageone").style.display = "none";
  });

  document
    .getElementById("assessmentForm")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      const ASSESSMENT_INDEX = document.getElementById("assessment_id");
      const ASSESSMENT_ID =
        ASSESSMENT_INDEX == null ? null : ASSESSMENT_INDEX.value;
      FIELD_IDS = [
        "food_source",
        "family_concerns",
        "other_children",
        "school_journey",
        "children_number",
        "education_situation",
        "family_health",
        "general_comments"
      ];
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
      if (emptyFields === 0) {
        let formData = new FormData(this);
        if (ASSESSMENT_ID !== null && ASSESSMENT_ID.length > 0) {
          axios
            .post(`/assessments/${ASSESSMENT_ID}`, formData, {
              method: "PUT"
            })
            .then(response => {
              $("#assessmentForm")[0].reset();
              $("#addAssessment").modal("hide");
              showAlert(response.data[0], response.data[1]);
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch(error => backendValidation(error.response.data.errors));
        } else {
          axios
            .post("/assessments", formData)
            .then(response => {
              $("#assessmentForm")[0].reset();
              $("#addAssessment").modal("hide");
              showAlert(response.data[0], response.data[1]);
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch(error => backendValidation(error.response.data.errors));
        }
      }
    });

  document.querySelectorAll(".editHome").forEach(element => {
    element.addEventListener("click", e => {
      axios
        .get(`/homes/${e.target.id}/edit`)
        .then(response => {
          data = response.data;
          document.getElementById("home_id").value = data.id;
          document.getElementById("home_name").value = data.name;
          document.getElementById("home_type").value = data.type;
          document.getElementById("home_head").value = data.head;
          document.getElementById("home_address").value = data.address;
          document.getElementById("home_clan").value = data.clan;
          document.getElementById("home_totem").value = data.totem;
          document.getElementById("home_religion").value = data.religion;
          document.getElementById("adults").value = data.adults;
          document.getElementById("minors").value = data.minors;
          document.getElementById("home_title").innerText = `Edit Home`;
          document.getElementById("save_home").innerText = `Update`;
          $("#addHome").modal("show");
        })
        .catch(error => console.log(error));
    });
  });

  //3. Delete Home
  deleteButtons = document.querySelectorAll(".delHome");
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener("click", e => {
      confirmDeletion("homes/destroy", e.target.id);
    });
  });
} catch (err) {}

try {
  document.getElementById("bring_children").addEventListener("click", e => {
    e.preventDefault();
    axios
      .get("/countchildren")
      .then(response => {
        if (response.data > 0) {
          if (e.target.dataset.receiver == "Home") {
            document.getElementById("receiving_home").value =
              e.target.dataset.id;
          } else {
            document.getElementById("receiving_school").value =
              e.target.dataset.id;
          }
          $("#resettleChild").modal("show");
        } else {
          showAlert("error", "There are No children!");
        }
      })
      .catch(e => {
        console.error(e);
      });
  });

  document.getElementById("searched_child").addEventListener("keyup", e => {
    let child_name = document.getElementById("searched_child").value;
    e.preventDefault();
    if (child_name == "" || child_name == undefined) {
      document.getElementById("picked_child").style.display = "none";
      return false;
    } else {
      let formData = new FormData();
      let options = [];
      formData.append("child_name", child_name);
      axios
        .post("/listAvailableChildren", formData)
        .then(response => {
          data = response.data;
          if (data.length == 0) {
            options.push(
              `<option value="0" disabled selected>No Children found...</option>`
            );
            document.getElementById("picked_child").innerHTML = options;
          } else {
            data.forEach(child => {
              options.push(
                `<option data-name="${child.name}" value="${child.id}">${child.name}</option>`
              );
            });
            document.getElementById(
              "picked_child"
            ).innerHTML = `<option value="">-Select Child-</option>${options}`;
          }
          document.getElementById("picked_child").style.display = "block";
        })
        .catch(err => {
          console.error(err);
        });
    }
  });

  document.getElementById("picked_child").addEventListener("change", e => {
    let selected_child = document.getElementById("picked_child");
    let options = e.target.children;

    for (let i = 0; i < options.length; i++) {
      if (options[i].value == selected_child.value) {
        document.getElementById("searched_child").value =
          options[i].dataset.name;
      }
    }
    document.getElementById("found_child").value = selected_child.value;
    document.getElementById("picked_child").style.display = "none";
  });

  document
    .getElementById("resettlingForm")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      FIELD_IDS = ["searched_child"];
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
      if (emptyFields === 0) {
        let formData = new FormData(this);
        let recipient =
          document.getElementById("receiving_home").value !== ""
            ? "/childhome"
            : "/childschool";
        axios
          .post(recipient, formData)
          .then(response => {
            $("#resettlingForm")[0].reset();
            $("#resettleChild").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    });
  document.getElementById("homeAssessment").addEventListener("click", e => {
    document.getElementById("assessed_home").value = e.target.dataset.id;
    $("#addAssessment").modal("show");
  });
} catch (err) {}

//Children
try {
  document.getElementById("childForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let CHILD_INDEX = document.getElementById("child_id");
    let CHILD_ID = CHILD_INDEX === null ? null : CHILD_INDEX.value;

    if (document.getElementById("abandoned").value == "Yes") {
      FIELD_IDS = [
        "admission_number",
        "child_name",
        "child_gender",
        "birth_date",
        "birth_order",
        "clan",
        "religion",
        "family_address",
        "totem",
        "admission_date",
        "brought_by",
        "child_status",
        "abandoned",
        "village",
        "parish",
        "district",
        "circumstances",
        "admission_reason",
        "health_condition",
        "duration",
        "duration_type"
      ];
    } else {
      FIELD_IDS = [
        "admission_number",
        "child_name",
        "child_gender",
        "birth_date",
        "birth_order",
        "clan",
        "religion",
        "family_address",
        "totem",
        "admission_date",
        "brought_by",
        "child_status",
        "abandoned",
        "admission_reason",
        "health_condition",
        "duration",
        "duration_type"
      ];
    }
    let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);

    if (emptyFields === 0) {
      if (CHILD_ID !== null && CHILD_ID != "") {
        let formData = new FormData(this);
        axios
          .post(`/children/${CHILD_ID}`, formData, {
            method: "PUT"
          })
          .then(response => {
            $("#childForm")[0].reset();
            $("#addChild").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      } else {
        let formData = new FormData(this);
        axios
          .post("/children", formData)
          .then(response => {
            console.log(response.data);
            $("#childForm")[0].reset();
            $("#addChild").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    }
  });

  //Edit child
  document.querySelectorAll(".editChild").forEach(element => {
    element.addEventListener("click", e => {
      axios
        .get(`/children/${e.target.id}/edit`)
        .then(response => {
          data = response.data;
          document.getElementById("child_id").value = data.id;
          document.getElementById("admission_number").value =
            data.admission_number;
          document.getElementById("child_name").value = data.name;
          document.getElementById("child_gender").value = data.gender;
          document.getElementById("birth_date").value = data.birthdate;
          document.getElementById("birth_order").value = data.birth_order;
          document.getElementById("child_clan").value = data.clan;
          document.getElementById("child_religion").value = data.religion;
          document.getElementById("child_totem").value = data.totem;
          document.getElementById("admission_date").value = data.admission_date;
          document.getElementById("abandoned").value = data.abandoned;
          document.getElementById("district").value = data.district;
          document.getElementById("subcounty").value = data.sub_county;
          document.getElementById("parish").value = data.parish;
          document.getElementById("village").value = data.village;
          document.getElementById("circumstances").value = data.circumstances;
          document.getElementById("admission_reason").value =
            data.admission_reason;
          document.getElementById("health_condition").value =
            data.health_condition;
          document.getElementById("duration").value = data.duration;
          document.getElementById("duration_type").value = data.duration_type;
          document.getElementById("brought_by").value = data.brought_by;
          document.getElementById("child_title").innerText = `Edit Child`;
          document.getElementById("save_child").innerText = `Update`;
          $("#addChild").modal("show");
        })
        .catch(error => console.log(error));
    });
  });

  // Delete child
  document.querySelectorAll(".delChild").forEach(element => {
    element.addEventListener("click", e => {
      confirmDeletion("children/destroy", e.target.id);
    });
  });
} catch (err) {
  console.log(err);
}

try {
  document
    .getElementById("evaluate_child")
    .addEventListener("click", function(e) {
      document.getElementById("evaluated_child").value = e.target.dataset.id;
      $("#addEvaluation").modal("show");
    });

  document.getElementById("child_case").addEventListener("click", function(e) {
    document.getElementById("affected_child").value = e.target.dataset.id;
    $("#addCase").modal("show");
  });

  document.getElementById("child_relatives").addEventListener("click", e => {
    document.getElementById("related_child").value = e.target.dataset.id;
    $("#addRelative").modal("show");
  });

  document
    .getElementById("process_general")
    .addEventListener("click", function(e) {
      e.preventDefault();
      FIELD_IDS = [
        "financial_ability",
        "food_sources",
        "number_of_meals",
        "food_eaten",
        "child_room"
      ];
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);

      if (emptyFields === 0) {
        document.getElementById("health_section").style.display = "block";
        document.getElementById("back_to_general").style.display = "block";
        document.getElementById("save_evaluation").style.display = "block";
        document.getElementById("general_section").style.display = "none";
        document.getElementById("process_general").style.display = "none";
      } else {
        console.log(emptyFields);
      }
    });

  document.getElementById("back_to_general").addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("health_section").style.display = "none";
    document.getElementById("general_section").style.display = "block";
    document.getElementById("process_general").style.display = "block";
    document.getElementById("save_evaluation").style.display = "none";
    document.getElementById("back_to_general").style.display = "none";
  });

  document
    .getElementById("evaluationForm")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      const EVALUATION_INDEX = document.getElementById("evaluation_id");
      const EVALUATION_ID =
        EVALUATION_INDEX == null ? null : EVALUATION_INDEX.value;
      FIELD_IDS = [
        "child_mobility",
        "child_concerns",
        "specific_actions",
        "child_comments"
      ];
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
      if (emptyFields === 0) {
        let formData = new FormData(this);
        if (EVALUATION_ID !== null && EVALUATION_ID.length > 0) {
          axios
            .post(`/evaluations/${EVALUATION_ID}`, formData, {
              method: "PUT"
            })
            .then(response => {
              $("#evaluationForm")[0].reset();
              $("#addEvaluation").modal("hide");
              showAlert(response.data[0], response.data[1]);
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch(error => backendValidation(error.response.data.errors));
        } else {
          axios
            .post("/evaluations", formData)
            .then(response => {
              $("#evaluationForm")[0].reset();
              $("#addEvaluation").modal("hide");
              showAlert(response.data[0], response.data[1]);
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch(error => backendValidation(error.response.data.errors));
        }
      }
    });

  document.getElementById("caseForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let CASE_INDEX = document.getElementById("case_id");
    let CASE_ID = CASE_INDEX === null ? null : CASE_INDEX.value;
    FIELD_IDS = ["care_order", "presiding_magistrate", "case_details"];
    let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);

    if (emptyFields === 0) {
      if (CASE_ID !== null && CASE_ID != "") {
        let formData = new FormData(this);
        axios
          .post(`/cases/${CASE_ID}`, formData, {
            method: "PUT"
          })
          .then(response => {
            $("#caseForm")[0].reset();
            $("#addCase").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      } else {
        let formData = new FormData(this);
        axios
          .post("/cases", formData)
          .then(response => {
            $("#caseForm")[0].reset();
            $("#addCase").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    }
  });

  document
    .getElementById("relativeForm")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      let RELATIVE_INDEX = document.getElementById("relative_id");
      let RELATIVE_ID = RELATIVE_INDEX === null ? null : RELATIVE_INDEX.value;
      if (document.getElementById("relative_alive").value != "Yes") {
        FIELD_IDS = ["relative_name", "relative_address", "relationship"];
      } else {
        FIELD_IDS = [
          "relative_name",
          "relative_address",
          "relative_occupation",
          "relationship",
          "relative_age"
        ];
      }
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);

      if (emptyFields === 0) {
        if (RELATIVE_ID !== null && RELATIVE_ID != "") {
          let formData = new FormData(this);
          axios
            .post(`/relatives/${RELATIVE_ID}`, formData, {
              method: "PUT"
            })
            .then(response => {
              $("#relativeForm")[0].reset();
              $("#addRelative").modal("hide");
              showAlert(response.data[0], response.data[1]);
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch(error => backendValidation(error.response.data.errors));
        } else {
          let formData = new FormData(this);
          axios
            .post("/relatives", formData)
            .then(response => {
              $("#relativeForm")[0].reset();
              $("#addRelative").modal("hide");
              showAlert(response.data[0], response.data[1]);
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch(error => backendValidation(error.response.data.errors));
        }
      }
    });

  document.querySelectorAll(".editRelative").forEach(element => {
    element.addEventListener("click", e => {
      axios
        .get(`/relatives/${e.target.id}/edit`)
        .then(response => {
          data = response.data;
          document.getElementById("relative_id").value = data.id;
          document.getElementById("relative_name").value = data.name;
          document.getElementById("relative_phone").value = data.phone;
          document.getElementById("relative_address").value = data.address;
          document.getElementById("relationship").value = data.relationship;
          document.getElementById("relative_alive").value = data.alive;
          document.getElementById("relative_occupation").value =
            data.occupation;
          document.getElementById("relative_age").value = data.age;
          document.getElementById("relative_title").innerText = `Edit Relative`;
          document.getElementById("save_relative").innerText = `Update`;
          $("#addRelative").modal("show");
        })
        .catch(error => console.log(error));
    });
  });

  document.querySelectorAll(".visit_child").forEach(element => {
    element.addEventListener("click", e => {
      document.getElementById("visited_child").value = e.target.dataset.child;
      document.getElementById("visiting_relative").value = e.target.id;
      $("#addVisit").modal("show");
    });
  });

  //Child Visits
  document.getElementById("visitForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let VISIT_INDEX = document.getElementById("visit_id");
    let VISIT_ID = VISIT_INDEX === null ? null : VISIT_INDEX.value;
    FIELD_IDS = ["visit_date", "visit_reason"];
    let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
    if (emptyFields === 0) {
      let formData = new FormData(this);
      if (VISIT_ID !== null && VISIT_ID != "") {
        axios
          .post(`/visits/${VISIT_ID}`, formData, {
            method: "PUT"
          })
          .then(response => {
            $("#visitForm")[0].reset();
            $("#addVisit").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      } else {
        axios
          .post("/visits", formData)
          .then(response => {
            $("#visitForm")[0].reset();
            $("#addVisit").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    }
  });

  document.querySelectorAll(".editVisit ").forEach(element => {
    element.addEventListener("click", e => {
      axios
        .get(`/visits/${e.target.id}/edit`)
        .then(response => {
          data = response.data;
          document.getElementById("visit_id").value = data[0].id;
          document.getElementById("visit_date").value = data[0].date;
          document.getElementById("visit_reason").value = data[0].reason;
          document.getElementById("visit_title").innerText = `Edit Visit`;
          document.getElementById("save_visit").innerText = `Update`;
          $("#addVisit").modal("show");
        })
        .catch(error => console.log(error));
    });
  });

  deleteButtons = document.querySelectorAll(".delVisit");
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener("click", e => {
      confirmDeletion("visits/destroy", e.target.id);
    });
  });

  document.querySelector(".text").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("face_id").value = e.target.id;
    document.getElementById("face_owner").value = e.target.dataset.owner;
    $("#changePicture").modal("show");
  });

  document.getElementById("child_attachment").addEventListener("click", e => {
    document.getElementById("owning_child").value = e.target.dataset.id;
    $("#addAttachment").modal("show");
  });
  document
    .getElementById("attachmentForm")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      FIELD_IDS = [
        "attachment_name",
        "attachment_category",
        "attachment",
        "attachment_description"
      ];
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
      if (emptyFields === 0) {
        let formData = new FormData(this);
        axios
          .post("/attachments", formData)
          .then(response => {
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    });

  deleteButtons = document.querySelectorAll(".delAttachment");
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener("click", e => {
      confirmDeletion("/attachments", e.target.id);
    });
  });
} catch (err) {}

try {
  document.getElementById("add_donation").addEventListener("click", e => {
    axios
      .get("/countdonors")
      .then(response => {
        if (response.data > 0) {
          $("#addDonation").modal("show");
        } else {
          showAlert("error", `We have no donors available...`);
        }
      })
      .catch(e => {
        console.error(e);
      });
  });
} catch (err) {}

try {
  document.getElementById("add_purchase").addEventListener("click", e => {
    axios
      .get("/countsuppliers")
      .then(response => {
        if (response.data > 0) {
          $("#addPurchase").modal("show");
        } else {
          showAlert("error", `We have no suppliers...`);
        }
      })
      .catch(e => {
        console.error(e);
      });
  });
} catch (err) {}

//Add users

try {
  document.getElementById("userForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const USER_INDEX = document.getElementById("user_id");
    const USER_ID = USER_INDEX == null ? null : USER_INDEX.value;
    FIELD_IDS =
      USER_INDEX == null
        ? [
            "staff_id",
            "firstname",
            "lastname",
            "user_gender",
            "user_birthdate",
            "mobile_phone",
            "email",
            "password",
            "password-confirm",
            "the_department",
            "the_title",
            "level",
            "account_status"
          ]
        : [
            "staff_id",
            "firstname",
            "lastname",
            "user_gender",
            "user_birthdate",
            "mobile_phone",
            "email",
            "password",
            "password-confirm",
            "the_department",
            "the_title",
            "the_group",
            "account_status"
          ];
    let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
    if (emptyFields === 0) {
      let formData = new FormData(this);
      if (USER_ID !== null && USER_ID.length > 0) {
        axios
          .post(`/users/${USER_ID}`, formData, {
            method: "PUT"
          })
          .then(response => {
            $("#userForm")[0].reset();
            $("#addUser").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      } else {
        axios
          .post("/users", formData)
          .then(response => {
            $("#userForm")[0].reset();
            $("#addUser").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    }
  });

  //Edit User
  document.querySelectorAll(".editUser").forEach(element => {
    element.addEventListener("click", e => {
      axios
        .get(`/users/${e.target.id}/edit`)
        .then(response => {
          data = response.data;
          document.getElementById("staff_id").value = data.staff_id;
          document.getElementById("firstname").value = data.firstname;
          document.getElementById("lastname").value = data.lastname;
          document.getElementById("user_gender").value = data.gender;
          document.getElementById("email").value = data.email;
          document.getElementById("mobile_phone").value = data.phone;
          document.getElementById("the_department").value = data.department_id;
          document.getElementById("the_title").value = data.title_id;
          document.getElementById("the_group").value = data.group_id;
          document.getElementById("account_status").value = data.account_status;
          document.getElementById("user_id").value = data.id;
          document.getElementById("logins").style.display = "none";
          document.getElementById("user_title").innerText = `Edit User`;
          $("#addUser").modal("show");
        })
        .catch(error => console.error(error));
    });
  });

  //Delete User
  document.querySelectorAll(".deleteUser").forEach(element => {
    element.addEventListener("click", e => {
      confirmDelete(e.target.id, "users");
    });
  });
} catch (err) {}

// User profile
try {
  document.querySelector(".text").addEventListener("click", function(e) {
    e.preventDefault();
    document.getElementById("face_id").value = e.target.id;
    document.getElementById("face_owner").value = e.target.dataset.owner;
    $("#changePicture").modal("show");
  });
  document
    .getElementById("picturesForm")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      FIELD_IDS = ["picture", "face_id", "face_owner"];
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
      if (emptyFields === 0) {
        let formData = new FormData(this);
        axios
          .post("/picture", formData)
          .then(response => {
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    });

  document
    .getElementById("profile_update")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      const USER_INDEX = document.getElementById("current_id");
      const USER_ID = USER_INDEX == null ? null : USER_INDEX.value;
      FIELD_IDS = [
        "current_firstname",
        "current_lastname",
        "current_birthdate",
        "current_phone",
        "current_gender"
      ];
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
      if (emptyFields === 0) {
        let formData = new FormData(this);
        if (USER_ID !== null && USER_ID.length > 0) {
          axios
            .post(`/update_profile/${USER_ID}`, formData, {
              method: "PUT"
            })
            .then(response => {
              showAlert(response.data[0], response.data[1]);
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch(error => backendValidation(error.response.data.errors));
        }
      }
    });
} catch (err) {}

// Activities
try {
  document
    .getElementById("activityForm")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      let FIELD_IDS = [
        "activity_title",
        "activity_start",
        "activity_end",
        "activity_description"
      ];
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
      if (emptyFields === 0) {
        let formData = new FormData(this);
        axios
          .post("/activities", formData)
          .then(response => {
            $("#activityForm")[0].reset();
            $("#addActivity").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    });
} catch (err) {}

// Donors
try {
  document.getElementById("donorForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let DONOR_INDEX = document.getElementById("donor_id");
    let DONOR_ID = DONOR_INDEX === null ? null : DONOR_INDEX.value;
    FIELD_IDS = [
      "donor_name",
      "donor_email",
      "donor_phone",
      "donor_country",
      "donor_address",
      "occupation"
    ];
    let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
    if (emptyFields === 0) {
      let formData = new FormData(this);
      if (DONOR_ID !== null && DONOR_ID != "") {
        axios
          .post(`/donors/${DONOR_ID}`, formData, {
            method: "PUT"
          })
          .then(response => {
            $("#donorForm")[0].reset();
            $("#addDonor").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      } else {
        axios
          .post("/donors", formData)
          .then(response => {
            $("#donorForm")[0].reset();
            $("#addDonor").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    }
  });

  document.querySelectorAll(".editDonor").forEach(element => {
    element.addEventListener("click", e => {
      axios
        .get(`/donors/${e.target.id}/edit`)
        .then(response => {
          data = response.data;
          document.getElementById("donor_id").value = data.id;
          document.getElementById("donor_name").value = data.name;
          document.getElementById("donor_email").value = data.email;
          document.getElementById("donor_phone").value = data.phone;
          document.getElementById("donor_country").value = data.country;
          document.getElementById("donor_address").value = data.address;
          document.getElementById("occupation").value = data.occupation;
          document.getElementById("donor_title").innerText = `Edit Donor`;
          document.getElementById("save_donor").innerText = `Update`;
          $("#addDonor").modal("show");
        })
        .catch(error => console.log(error));
    });
  });

  //3. Delete Donor
  deleteButtons = document.querySelectorAll(".delDonor");
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener("click", e => {
      confirmDeletion("donors/destroy", e.target.id);
    });
  });
} catch (err) {}

// Donations

try {
  document
    .getElementById("donationForm")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      let DONATION_INDEX = document.getElementById("donation_id");
      let DONATION_ID = DONATION_INDEX === null ? null : DONATION_INDEX.value;
      FIELD_IDS = [
        "donor",
        "donation_amount",
        "donation_currency",
        "donation_description"
      ];
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
      if (emptyFields === 0) {
        let formData = new FormData(this);
        if (DONATION_ID !== null && DONATION_ID != "") {
          axios
            .post(`/donations/${DONATION_ID}`, formData, {
              method: "PUT"
            })
            .then(response => {
              $("#donationForm")[0].reset();
              $("#addDonation").modal("hide");
              showAlert(response.data[0], response.data[1]);
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch(error => backendValidation(error.response.data.errors));
        } else {
          axios
            .post("/donations", formData)
            .then(response => {
              $("#donationForm")[0].reset();
              $("#addDonation").modal("hide");
              showAlert(response.data[0], response.data[1]);
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch(error => backendValidation(error.response.data.errors));
        }
      }
    });

  document.querySelectorAll(".editDonation").forEach(element => {
    element.addEventListener("click", e => {
      axios
        .get(`/donations/${e.target.id}/edit`)
        .then(response => {
          data = response.data;
          document.getElementById("donation_id").value = data.id;
          document.getElementById("donor").value = data.donor_id;
          document.getElementById("donation_amount").value = data.amount;
          document.getElementById("donation_currency").value = data.currency;
          document.getElementById("donation_description").value =
            data.description;
          document.getElementById("donation_title").innerText = `Edit Donation`;
          document.getElementById("save_donation").innerText = `Update`;
          $("#addDonation").modal("show");
        })
        .catch(error => console.log(error));
    });
  });

  //3. Delete Donation
  deleteButtons = document.querySelectorAll(".delDonation");
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener("click", e => {
      confirmDeletion("donations/destroy", e.target.id);
    });
  });
} catch (err) {}

// Groups

try {
  document.getElementById("groupForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let GROUP_INDEX = document.getElementById("group_id");
    let GROUP_ID = GROUP_INDEX === null ? null : GROUP_INDEX.value;
    FIELD_IDS = ["group_name", "group_description"];
    let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
    if (emptyFields === 0) {
      let formData = new FormData(this);
      if (GROUP_ID !== null && GROUP_ID != "") {
        axios
          .post(`/groups/${GROUP_ID}`, formData, {
            method: "PUT"
          })
          .then(response => {
            $("#groupForm")[0].reset();
            $("#addGroup").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      } else {
        axios
          .post("/groups", formData)
          .then(response => {
            $("#groupForm")[0].reset();
            $("#addGroup").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    }
  });

  document.querySelectorAll(".editGroup").forEach(element => {
    element.addEventListener("click", e => {
      axios
        .get(`/groups/${e.target.id}/edit`)
        .then(response => {
          data = response.data;
          document.getElementById("group_id").value = data.id;
          document.getElementById("group_name").value = data.name;
          document.getElementById("group_description").value = data.description;
          document.getElementById("group_title").innerText = `Edit Group`;
          document.getElementById("save_group").innerText = `Update`;
          $("#addGroup").modal("show");
        })
        .catch(error => console.log(error));
    });
  });

  //3. Delete Group
  deleteButtons = document.querySelectorAll(".delGroup");
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener("click", e => {
      confirmDeletion("groups/destroy", e.target.id);
    });
  });
} catch (err) {}

// Titles

try {
  document.getElementById("titleForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let TITLE_INDEX = document.getElementById("title_id");
    let TITLE_ID = TITLE_INDEX === null ? null : TITLE_INDEX.value;
    FIELD_IDS = ["title_name", "title_description"];
    let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
    if (emptyFields === 0) {
      let formData = new FormData(this);
      if (TITLE_ID !== null && TITLE_ID != "") {
        axios
          .post(`/titles/${TITLE_ID}`, formData, {
            method: "PUT"
          })
          .then(response => {
            $("#titleForm")[0].reset();
            $("#addTitle").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      } else {
        axios
          .post("/titles", formData)
          .then(response => {
            $("#titleForm")[0].reset();
            $("#addTitle").modal("hide");
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    }
  });

  document.querySelectorAll(".editTitle").forEach(element => {
    element.addEventListener("click", e => {
      axios
        .get(`/titles/${e.target.id}/edit`)
        .then(response => {
          data = response.data;
          document.getElementById("title_id").value = data.id;
          document.getElementById("title_name").value = data.name;
          document.getElementById("title_description").value = data.description;
          document.getElementById("title_title").innerText = `Edit Title`;
          document.getElementById("save_title").innerText = `Update`;
          $("#addTitle").modal("show");
        })
        .catch(error => console.log(error));
    });
  });

  //3. Delete Title
  deleteButtons = document.querySelectorAll(".delTitle");
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener("click", e => {
      confirmDeletion("titles/destroy", e.target.id);
    });
  });
} catch (err) {}

// Departments

try {
  document
    .getElementById("departmentForm")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      let DEPARTMENT_INDEX = document.getElementById("department_id");
      let DEPARTMENT_ID =
        DEPARTMENT_INDEX === null ? null : DEPARTMENT_INDEX.value;
      FIELD_IDS = ["department_name", "department_code", "department_head"];
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
      if (emptyFields === 0) {
        let formData = new FormData(this);
        if (DEPARTMENT_ID !== null && DEPARTMENT_ID != "") {
          axios
            .post(`/departments/${DEPARTMENT_ID}`, formData, {
              method: "PUT"
            })
            .then(response => {
              $("#departmentForm")[0].reset();
              $("#addDepartment").modal("hide");
              location.reload();
              showAlert(response.data[0], response.data[1]);
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch(error => backendValidation(error.response.data.errors));
        } else {
          axios
            .post("/departments", formData)
            .then(response => {
              $("#departmentForm")[0].reset();
              $("#addDepartment").modal("hide");
              location.reload();
              showAlert(response.data[0], response.data[1]);
              setTimeout(() => {
                location.reload();
              }, 2000);
            })
            .catch(error => backendValidation(error.response.data.errors));
        }
      }
    });

  document.querySelectorAll(".editDepartment").forEach(element => {
    element.addEventListener("click", e => {
      axios
        .get(`/departments/${e.target.id}/edit`)
        .then(response => {
          data = response.data;
          document.getElementById("department_id").value = data[0].id;
          document.getElementById("department_name").value = data[0].name;
          document.getElementById("department_code").value = data[0].code;
          document.getElementById("department_head").value = data[1].head;
          document.getElementById(
            "department_title"
          ).innerText = `Edit Department`;
          document.getElementById("save_department").innerText = `Update`;
          $("#addDepartment").modal("show");
        })
        .catch(error => console.log(error));
    });
  });

  //3. Delete Department
  deleteButtons = document.querySelectorAll(".delDepartment");
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener("click", e => {
      confirmDeletion("departments/destroy", e.target.id);
    });
  });
} catch (err) {}

// Feedback

try {
  document
    .getElementById("feedBackForm")
    .addEventListener("submit", function(e) {
      e.preventDefault();
      FIELD_IDS = ["txtSubject", "txtMsg"];
      let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
      if (emptyFields === 0) {
        let formData = new FormData(this);
        axios
          .post("/support", formData)
          .then(response => {
            $("#feedBackForm")[0].reset();
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      } else {
        console.log(emptyFields);
      }
    });
} catch (e) {}

try {
  document.getElementById("add_case").addEventListener("click", e => {
    e.preventDefault();
    axios
      .get("/countchildren")
      .then(response => {
        if (response.data > 0) {
          document.getElementById("receiving_home").value = e.target.dataset.id;
          $("#resettleChild").modal("show");
        } else {
          showAlert("error", `No records about children...`);
        }
      })
      .catch(e => {
        console.error(e);
      });
  });
} catch (e) {}

// Schools
try {
  document.getElementById("schoolForm").addEventListener("submit", function(e) {
    e.preventDefault();
    let SCHOOL_INDEX = document.getElementById("school_id");
    let SCHOOL_ID = SCHOOL_INDEX === null ? null : SCHOOL_INDEX.value;
    FIELD_IDS = [
      "school_name",
      "school_address",
      "school_type",
      "school_location"
    ];
    let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
    if (emptyFields === 0) {
      let formData = new FormData(this);
      if (SCHOOL_ID !== null && SCHOOL_ID != "") {
        axios
          .post(`/schools/${SCHOOL_ID}`, formData, {
            method: "PUT"
          })
          .then(response => {
            $("#schoolForm")[0].reset();
            $("#addSchool").modal("hide");
            location.reload();
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      } else {
        axios
          .post("/schools", formData)
          .then(response => {
            $("#schoolForm")[0].reset();
            $("#addSchool").modal("hide");
            location.reload();
            showAlert(response.data[0], response.data[1]);
            setTimeout(() => {
              location.reload();
            }, 2000);
          })
          .catch(error => backendValidation(error.response.data.errors));
      }
    }
  });

  document.querySelectorAll(".editSchool").forEach(element => {
    element.addEventListener("click", e => {
      axios
        .get(`/schools/${e.target.id}/edit`)
        .then(response => {
          data = response.data;
          document.getElementById("school_id").value = data.id;
          document.getElementById("school_name").value = data.name;
          document.getElementById("school_address").value = data.address;
          document.getElementById("school_type").value = data.type;
          document.getElementById("school_location").value = data.location;
          document.getElementById("school_title").innerText = `Edit School`;
          document.getElementById("save_school").innerText = `Update`;
          $("#addSchool").modal("show");
        })
        .catch(error => console.log(error));
    });
  });

  //3. Delete School
  deleteButtons = document.querySelectorAll(".delSchool");
  deleteButtons.forEach(deleteButton => {
    deleteButton.addEventListener("click", e => {
      confirmDeletion("schools/destroy", e.target.id);
    });
  });
} catch (e) {}

/*
 *Reusable methods
 */

const exportExcel = (tableId, filename = null) => {
  let downloadLink;
  let dataType = "application/vnd.ms-excel";
  let tableSelect = document.getElementById(tableId);
  let tableHTML = tableSelect.outerHTML.replace(/ /g, "%20");
  filename = filename ? filename + ".xls" : "AH_Consulting.xls";
  downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);
  if (navigator.msSaveOrOpenBlob) {
    let blob = new Blob(["\ufeff", tableHTML], {
      type: dataType
    });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    downloadLink.href = "data:" + dataType + "," + tableHTML;
    downloadLink.download = filename;
    downloadLink.click();
  }
};

const confirmDelete = (id, item) => {
  document.getElementById("target_id").value = id;
  document.getElementById("target_url").value = item;
  $("#warnModal").modal("show");
};

const deleteItem = url => {
  axios
    .delete(url)
    .then(response => {
      showAlert(response.data[0], response.data[1]);
      setTimeout(() => {
        location.reload();
      }, 2000);
    })
    .catch(error => backendValidation(error.response.data.errors));
};

const elementAdd = (parentID, position, element) => {
  const PARENT = document.getElementById(parentID);
  if (PARENT !== null) PARENT.insertAdjacentHTML(position, element);
};

const elementRemove = elementID => {
  const ELEMENT = document.getElementById(elementID);
  if (ELEMENT !== null) ELEMENT.parentNode.removeChild(ELEMENT);
};

const markerAttach = elementID => {
  const ELEMENT = document.getElementById(elementID);
  if (ELEMENT !== null) ELEMENT.classList.add("is-invalid");
};

const markerDetach = elementID => {
  const ELEMENT = document.getElementById(elementID);
  if (ELEMENT !== null) ELEMENT.classList.remove("is-invalid");
};

const calculateResults = (url, formId, exportBtn) => {
  let formData = new FormData(formId);
  for (let i = 0; i < FIELD_IDS.length; i++) {
    formData.append(
      document.getElementById(FIELD_IDS[i]).name,
      document.getElementById(FIELD_IDS[i]).value
    );
  }
  axios
    .post(`/${url}`, formData)
    .then(response => {
      data = response.data;
      recordsHTML = "";
      if (data != "") {
        recordsHTML += `<table id="sorted_children" class="table table-bordered table-sm">
            <thead class="bg-success text-white"><tr><td>OM Number</td><td>Name</td><td>Type</td><td>Stage</td><td>Country</td><td>Revenue</td></tr></thead><tbody>`;
        for (let i = 0; i < data.length; i++) {
          recordsHTML += `<tr><td>
                <a href="/children/${data[i].id}" class="text-primary" title="View Opportunity">${data[i].om_number}</a></td><td>${data[i].name}</td><td>${data[i].type}</td><td>${data[i].sales_stage}</td><td>${data[i].country}</td><td>${data[i].revenue}</td></tr>`;
        }
        recordsHTML += `<tbody></table>`;
        document.getElementById(
          "summaries"
        ).innerHTML = `Total records - ${data.length}`;
        elementAdd("records-list", "beforeend", recordsHTML);
        document.getElementById(exportBtn).style.display = "block";
      } else {
        document.getElementById("summaries").innerText = `No records found`;
        document.getElementById(exportBtn).style.display = "none";
      }
      document.getElementById("records-list").style.display = "block";
      document.getElementById("loading").style.display = "none";
    })
    .catch(error => {
      backendValidation(error.response.data.errors);
    });
};

const getDocument = e => {
  document.getElementById("owning_child").value = e.target.dataset.id;
  $("#addAttachment").modal("show");
};

const backendValidation = response => {
  Object.keys(response).forEach(item => {
    const itemDom = document.getElementById(item);
    const errorMessage = response[item];
    const errorMessages = document.querySelectorAll(".text-danger");
    errorMessages.forEach(Element => (Element.textContent = ""));
    const formControls = document.querySelectorAll(".form-control");
    formControls.forEach(Element =>
      Element.classList.remove("border", "border-danger")
    );
    itemDom.classList.add("border", "border-danger");
    itemDom.insertAdjacentHTML(
      "afterend",
      `<div class="text-danger">${errorMessage}</div>`
    );
  });

  return false;
};

const UIValidate = (FIELD_IDS, ERROR_COUNT) => {
  for (let i = 0; i < FIELD_IDS.length; i++) {
    elementRemove(`error-${FIELD_IDS[i]}`);

    if (
      document.getElementById(FIELD_IDS[i]) !== null &&
      document.getElementById(FIELD_IDS[i]).value == ""
    ) {
      ERROR_COUNT++;
      elementAdd(
        FIELD_IDS[i],
        "afterend",
        `<p id="error-${FIELD_IDS[i]}" class="text-danger">This is required!</p>`
      );
      markerAttach(FIELD_IDS[i]);
    } else {
      elementRemove(`error-${FIELD_IDS[i]}`);
      markerDetach(FIELD_IDS[i]);
    }
  }
  return ERROR_COUNT;
};

const toArray = obj => {
  let array = [];
  for (let i = obj.length >>> 0; i--; ) {
    array[i] = obj[i];
  }
  return array;
};

const validateDynamic = (FIELDS, ERROR_COUNT) => {
  for (let i = 0; i < FIELDS.length; i++) {
    elementRemove(`error-${FIELDS[i]}`);

    if (
      document.getElementById(FIELDS[i]) !== null &&
      document.getElementById(FIELDS[i]).value == ""
    ) {
      ERROR_COUNT++;
      elementAdd(
        FIELDS[i],
        "afterend",
        `<p id="error-${FIELDS[i]}" class="text-danger">Required!</p>`
      );
      markerAttach(FIELDS[i]);
    } else {
      elementRemove(`error-${FIELDS[i]}`);
      markerDetach(FIELDS[i]);
    }
  }
  return ERROR_COUNT;
};

const removeRow = id => {
  document.getElementById(`row${id}`).remove();
};

const clearAlert = () => {
  let currentAlert = document.querySelector(".alert");
  if (currentAlert) {
    currentAlert.remove();
  }
};

const showAlert = (alert_class, alert_message) => {
  window.notyf.open({
    type: alert_class,
    message: alert_message,
    duration: 2000,
    ripple: true,
    dismissible: true,
    position: {
      x: "right",
      y: "top"
    }
  });
};

const previewContent = el => {
  let restorePage = document.body.innerHTML;
  let printContent = document.getElementById(el).innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = restorePage;
};

const createComment = (id, modal) => {
  document.getElementById("commentable_id").value = id;
  document.getElementById("commentable_type").value = `App\\${modal}`;
  document.getElementById("comment_title").innerText = `${modal} Comments`;
  $("#addComments").modal("show");
};

const saveComment = formId => {
  const COMMENT_INDEX = document.getElementById("comment_id");
  const COMMENT_ID = COMMENT_INDEX == null ? null : COMMENT_INDEX.value;
  FIELD_IDS = ["comment_body", "commentable_type", "commentable_id"];
  let emptyFields = UIValidate(FIELD_IDS, ERROR_COUNT);
  if (emptyFields === 0) {
    let formData = new FormData(formId);
    if (COMMENT_ID !== null && COMMENT_ID.length > 0) {
      axios
        .post(`/comments/${COMMENT_ID}`, formData, {
          method: "PUT"
        })
        .then(response => {
          $("#commentsForm")[0].reset();
          $("#addComments").modal("hide");
          showAlert(response.data[0], response.data[1]);
          setTimeout(() => {
            location.reload();
          }, 2000);
        })
        .catch(error => backendValidation(error.response.data.errors));
    } else {
      axios
        .post("/comments", formData)
        .then(response => {
          $("#commentsForm")[0].reset();
          $("#addComments").modal("hide");
          showAlert(response.data[0], response.data[1]);
          setTimeout(() => {
            location.reload();
          }, 2000);
        })
        .catch(error => backendValidation(error.response.data.errors));
    }
  }
};

const capitalize = s => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const confirmDeletion = (url, id) => {
  document.getElementById("target_url").value = url;
  document.getElementById("target_id").value = id;
  $("#warnModal").modal("show");
};

const executeDeletion = () => {
  let url = document.getElementById("target_url").value;
  let element = document.getElementById("target_id").value;
  axios
    .delete(`${url}/${element}`)
    .then(response => {
      $("#warnModal").modal("hide");
      showAlert(response.data[0], response.data[1]);
      setTimeout(() => {
        location.reload();
      }, 2000);
    })
    .catch(error => {
      console.log(error);
    });
};

const getFilename = id => {
  let fileName = document.getElementById(id).files[0].name;
  let nextSibling = e.target.nextElementSibling;
  nextSibling.innerText = fileName;
};

const save_thisform = e => {
  e.preventDefault();
  console.log(e);
};
