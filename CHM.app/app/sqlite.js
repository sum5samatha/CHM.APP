document.addEventListener("deviceready", init, false);
document.addEventListener("backbutton", function (e) {
    e.preventDefault();
}, false);

var app = {};
app.db = null;

function init() {
    app.openDb();
    //app.db.transaction(function (tx) {
    //    tx.executeSql("INSERT INTO Residents(ID,OrganizationID,FirstName,LastName,NickName,Gender,DOB,DOJ,Telephone,Mobile,GPDetails,Nok,NokTelephoneNumber,NokAddress,NokPreferred,SocialWorker,ReasonForAdmission,IsAccepted,AdmittedFrom,NHS,MedicalHistory,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated)VALUES('9786D1F2-E4E4-4A99-9716-30DE0B211D5D','A3BE0758-7999-4674-89DE-3FD91F99FDD9','Test1','Test1','Test1','M','2016-11-27','2016-11-30','9874568521','9874568525','hyd','dfdf','87451254878','hyd','5','abc','frr','false','2016-11-27','222-154-1414','gffg','true','2016-12-21 09:50:06.617','81FCAF89-20E3-4E03-9F63-0E033F4F4905','2016-12-21 09:50:06.617','81FCAF89-20E3-4E03-9F63-0E033F4F4905','false','true')");
    //    tx.executeSql("INSERT INTO ResidentPhotos(ID,PhotoURL,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES ('9786D1F1-E4E4-4A99-9716-30DE0B211D5S','C:\\Users\\Samatha\\Pictures\\images.jpg','true','2016-12-21 09:50:06.617','81FCAF89-20E3-4E03-9F63-0E033F4F4905','2016-12-21 09:50:06.617','81FCAF89-20E3-4E03-9F63-0E033F4F4905','false','true')");

    //});
    //app.db.transaction(function (tx) {
    //    tx.executeSql("DROP TABLE IF EXISTS PainMonitoring");
    //});
    //app.db.transaction(function (tx) {
    //    tx.executeSql("DROP TABLE IF EXISTS Residents");
    //});

    //app.dropTable();   
    app.createTable();

}

app.openDb = function () {

    if (window.sqlitePlugin !== undefined) {
        app.db = window.sqlitePlugin.openDatabase("CHMMobile");
    } else {
        app.db = window.openDatabase("CHMMobile", "1.0", "Cordova Demo", 200000);
    }
}

app.dropTable = function () {
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Actions");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Actions_Days");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Intervention_Question");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Intervention_Question_Answer");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Intervention_Question_Answer_Task");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Intervention_Question_ParentQuestion");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Interventions");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Interventions_Question_Answer_Summary");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Interventions_Resident_Answers");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS OrganizationGroups");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS OrganizationGroups_Organizations");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Organizations");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Question_ParentQuestion");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Resident_Interventions_Questions_Answers");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Residents");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Residents_Questions_Answers");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Residents_Relatives");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Roles");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Section_Intervention");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Section_Intervention_Statements");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Section_Summary");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Sections");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Sections_Organizations");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Sections_Questions");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Sections_Questions_Answers");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Sections_Questions_Answers_Summary");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Sections_Questions_Answers_Tasks");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Sections_Questions_Answers_Widget");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Users");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Users_Organizations");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Users_Roles");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS ResidentPhotos");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Login");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS InterventionResidentAnswerDocuments");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS ResidentAnswerDocuments");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS UserType");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS PainMonitoring");
    });
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS ResidentAdhocInterventionDocuments");
    });
    //Anil
    app.db.transaction(function (tx) {
        tx.executeSql("DROP TABLE IF EXISTS Configurations");
    });
}

app.createTable = function () {

    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Roles(ID wibblewibble NOT NULL primary key,Name TEXT NOT NULL,IsActive BOOLEAN NOT NULL)", []);
    });

    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Users(ID wibblewibble NOT NULL primary key,FirstName TEXT NOT NULL,LastName TEXT,Email TEXT, Designation TEXT NOT NULL,DOB DATETIME,TelePhone INTEGER,UserName TEXT NOT NULL,Password TEXT NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME, CreatedBy wibblewibble NOT NULL,Modified DATETIME,ModifiedBy wibblewibble NOT NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Users_Roles(ID wibblewibble NOT NULL primary key,UserID wibblewibble NOT NULL,RoleID wibblewibble NOT NULL,IsActive BOOLEAN NOT NULL)", []);
    });

    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS UserType(ID wibblewibble NOT NULL primary key,Name TEXT NOT NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Organizations(ID wibblewibble NOT NULL primary key,Name TEXT NOT NULL,Description TEXT,Address TEXT,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Users_Organizations(ID wibblewibble NOT NULL primary key,UserID wibblewibble NOT NULL,OrganizationID wibblewibble NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS OrganizationGroups(ID wibblewibble NOT NULL primary key,Name TEXT NOT NULL,Description TEXT,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });

    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS OrganizationGroups_Organizations(ID wibblewibble NOT NULL primary key,OrganizationGroupID wibblewibble NOT NULL,OrganizationID wibblewibble NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });

    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Intervention_Question(ID wibblewibble NOT NULL primary key,Section_InterventionID wibblewibble NOT NULL,Question TEXT NOT NULL,AnswerType TEXT NOT NULL,MinScore INTEGER,MaxScore INTEGER,Score INTEGER,DisplayOrder INTEGER,IsInAssessment BOOLEAN,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });

    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Intervention_Question_Answer(ID wibblewibble NOT NULL primary key,Section_InterventionID wibblewibble NOT NULL,Intervention_QuestionID wibblewibble NOT NULL,LabelText TEXT NOT NULL,IsDefault BOOLEAN,Score INTEGER,DisplayOrder INTEGER NOT NULL,AnswerType TEXT NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble)", []);
    });

    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Sections_Questions_Answers(ID wibblewibble NOT NULL primary key,SectionID wibblewibble NOT NULL,Section_QuestionID wibblewibble NOT NULL,LabelText TEXT,IsDefault BOOLEAN,Score INTEGER,DisplayOrder INTEGER NOT NULL,AnswerType TEXT NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Intervention_Question_Answer_Task(ID wibblewibble NOT NULL primary key,InterventionQuestionID wibblewibble NOT NULL,InterventionAnswerID wibblewibble NOT NULL,Section_InterventionID wibblewibble NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Intervention_Question_ParentQuestion(ID wibblewibble NOT NULL primary key,InterventionQuestionID wibblewibble NOT NULL,InterventionParentQuestionID wibblewibble NOT NULL,InterventionParentAnswerID wibblewibble NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble)", []);
    });

    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Interventions(ID wibblewibble NOT NULL primary key,Action_DayID wibblewibble NOT NULL,PlannedStartDate DATETIME NOT NULL,PlannedEndDate DATETIME NOT NULL,ActualStartDate DATETIME,ActualEndDate DATETIME,Status TEXT,Comments TEXT,MoodAfter TEXT,MoodDuring TEXT,MoodBefore TEXT,OutCome TEXT,Exception TEXT,Time_Span TEXT,IsActive BOOLEAN NOT NULL,IsHandOverNotes TEXT,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME NOT NULL ,ModifiedBy wibblewibble NOT NULL,IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Interventions_Question_Answer_Summary(ID wibblewibble NOT NULL primary key,Intervention_Question_AnswerID wibblewibble NOT NULL,InterventionQuestionID wibblewibble NOT NULL,SectionSummaryID wibblewibble NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });

    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Question_ParentQuestion(ID wibblewibble NOT NULL primary key,QuestionID wibblewibble NOT NULL,ParentQuestionID wibblewibble NOT NULL,ParentAnswerID wibblewibble,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble,Modified DATETIME NOT NULL ,ModifiedBy wibblewibble NOT NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Sections(ID wibblewibble NOT NULL primary key,Name TEXT NOT NULL,DisplayOrder INTEGER NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL,HasScore BOOLEAN,HasSummary BOOLEAn)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Sections_Organizations(ID wibblewibble NOT NULL primary key,SectionID wibblewibble NOT NULL,OrganizationID wibblewibble NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Section_Intervention_Statements(ID wibblewibble NOT NULL primary key,Statements TEXT NOT NULL,Section_InterventionID wibblewibble NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Section_Summary(ID wibblewibble NOT NULL primary key,Summary,IsAnswerText BOOLEAN NOT NULL,MaxScore INTEGER,MinScore INTEGER,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Sections_Questions_Answers_Widget(ID wibblewibble NOT NULL primary key,Section_QuestionID  wibblewibble  NOT NULL,Section_Question_AnswerID wibblewibble  NOT NULL,Widget TEXT NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Sections_Questions_Answers_Tasks(ID wibblewibble NOT NULL primary key,Section_QuestionID  wibblewibble  NOT NULL,Section_Question_AnswerID wibblewibble NULL,Section_InterventionID  wibblewibble NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Sections_Questions_Answers_Summary(ID wibblewibble NOT NULL primary key,Section_Question_AnswerID wibblewibble,Section_QuestionID wibblewibble  NOT NULL,SectionSummaryID wibblewibble NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });

    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Sections_Questions(ID wibblewibble NOT NULL primary key,SectionID wibblewibble  NOT NULL,Question TEXT NOT NULL,QuestionView TEXT,AnswerType TEXT NOT NULL,MinScore INTEGER,MaxScore INTEGER,Score INTEGER,DisplayOrder INTEGER NOT NULL ,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL)", []);
    });


    app.db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS Residents(ID wibblewibble NOT NULL primary key,OrganizationID wibblewibble NOT NULL,FirstName TEXT NOT NULL,LastName TEXT,NickName TEXT,Gender TEXT NOT NULL,DOB DATETIME NOT NULL,DOJ DATETIME,Telephone INTERGER,Mobile INTEGER,GPDetails TEXT,Nok TEXT, NokTelephoneNumber INTEGER,NokAddress TEXT,NokPreferred NULL,SocialWorker NULL,ReasonForAdmission TEXT,IsAccepted BOOLEAN,AdmittedFrom DATETIME NOT NULL,NHS INTEGER NOT NULL,MedicalHistory TEXT NOT NULL,LeavingDate DATETIME,ReasonForLeaving TEXT,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME NOT NULL ,ModifiedBy wibblewibble NOT NULL,IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Residents_Relatives(ID wibblewibble NOT NULL primary key,ResidentID wibblewibble NOT NULL,UserID wibblewibble NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME NOT NULL,ModifiedBy wibblewibble NOT NULL,IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Actions(ID wibblewibble NOT NULL primary key,ResidentID wibblewibble NOT NULL,Section_InterventionID wibblewibble NOT NULL,StartDate DATETIME,EndDate DATETIME,Occurrences INTEGER,Type TEXT NOT NULL,Interval INTEGER,Instance INTEGER,Month INTEGER,IsAdhocIntervention BOOLEAN,IsActive BOOLEAN NOT NULL,Created DATETIME,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble NOT NULL,IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Actions_Days(ID wibblewibble NOT NULL primary key,ActionID wibblewibble NOT NULL,Day INTEGER,Date INTEGER,StartTime DATETIME NOT NULL,EndTime DATETIME NOT NULL,Specifications TEXT,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME NOT NULL ,ModifiedBy wibblewibble NOT NULL,IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Interventions_Resident_Answers(ID wibblewibble NOT NULL primary key,InterventionID wibblewibble NOT NULL,ResidentID wibblewibble NOT NULL,Intervention_Question_AnswerID wibblewibble NOT NULL,AnswerText TEXT,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble, IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Resident_Interventions_Questions_Answers(ID wibblewibble NOT NULL primary key,ResidentID wibblewibble NOT NULL,Intervention_Question_AnswerID wibblewibble NOT NULL,AnswerText TEXT,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble,IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });

    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Residents_Questions_Answers(ID wibblewibble NOT NULL primary key,ResidentID wibblewibble NOT NULL,Section_Question_AnswerID wibblewibble NOT NULL,AnswerText TEXT,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME NOT NULL,ModifiedBy wibblewibble NOT NULL,IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });

    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS Section_Intervention(ID wibblewibble NOT NULL primary key,InterventionTitle TEXT NOT NULL,InterventionIcon TEXT NOT NULL,MaxScore INTEGER,MinScore INTEGER,Parent_InterventionID wibblewibble,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble)", []);
    });


    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS ResidentPhotos(ID wibblewibble NOT NULL primary key,PhotoURL BLOB NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble,IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });

    app.db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS Login(UserID wibblewibble NOT NULL,UserName TEXT NOT NULL ,Password TEXT NOT NULL, LastLogin DATETIME, RoleName TEXT NOT NULL, IsSyncnised BOOLEAN)", []);
    });


    app.db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS ResidentAnswerDocuments(ID wibblewibble NOT NULL primary key,FileName TEXT NULL,ResidentFile BLOB NOT NULL ,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble,IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });

    app.db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS ResidentAdhocInterventionDocuments(ID wibblewibble NOT NULL primary key,FileName TEXT NULL,ResidentFile BLOB NOT NULL ,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble,IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });

    app.db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS InterventionResidentAnswerDocuments(ID wibblewibble NOT NULL primary key,FileName TEXT NULL,ResidentFile BLOB NOT NULL ,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NOT NULL,Modified DATETIME ,ModifiedBy wibblewibble,IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });
    app.db.transaction(function (tx) {

        tx.executeSql("CREATE TABLE IF NOT EXISTS PainMonitoring(ID wibblewibble NOT NULL primary key,ResidentID wibblewibble NOT NULL,OrganizationID wibblewibble NOT NULL,PartsID wibblewibble NOT NULL,Description TEXT NOT NULL,IsActive BOOLEAN NOT NULL,Created DATETIME NOT NULL,CreatedBy wibblewibble NULL,Modified DATETIME NOT NULL ,ModifiedBy wibblewibble NULL,IsSyncnised BOOLEAN,IsCreated BOOLEAN NULL)", []);
    });
    //Anil
    app.db.transaction(function (tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS Configurations(ID wibblewibble NOT NULL primary key,OrganizationID wibblewibble NULL, ConfigurationKey TEXT NOT NULL, ConfigurationValue TEXT NOT NULL)", []);
    });
}

app.GetOfflineResidentPhotos = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM ResidentPhotos WHERE IsActive=?", [true], fn);
    });
}
app.GetAllResidentPhotos = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM ResidentPhotos", fn);
    });
}

//ManiSankar
app.GetOfflineActions = function (fn) {
    if (!app.db)
        app.openDb();
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Actions WHERE IsActive=?", [true], fn, errLog);
    });
};

//ManiSankar
app.GetOfflineAction_Days = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Actions_Days WHERE IsActive=?", [true], fn, errLog);
    });
};

//ManiSankar
app.GetOfflineInterventions = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Interventions WHERE IsActive=?", [true], fn, errLog);
    });
};

//ManiSankar
app.GetOfflineSection_Interventions = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Section_Intervention WHERE IsActive=?", [true], fn, errLog);
    });
};

app.GetOfflineInterventionsResidentAnswers = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Interventions_Resident_Answers WHERE IsActive=?", [true], fn, errLog);
    });
};

//ManiSankar
app.GetOfflineResidents = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Residents WHERE IsActive=?", [true], fn, errLog);
    });
};

app.GetOfflinePainMonitoring = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM PainMonitoring  WHERE IsActive=?", [true], fn, errLog);
    });
};

app.GetAllResidents = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Residents");
    });
};
app.GetOfflineResidentsIsAccepted = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Residents WHERE IsActive=? and IsAccepted= ?", [true, true], fn, errLog);
    });
};


//app.DataForDailyDairyOffline = function (fn) {

//    app.db.transaction(function (tx) {
//        tx.executeSql("SELECT * FROM Actions WHERE IsActive=?", [true], fn);
//    });
//    app.db.transaction(function (tx) {
//        tx.executeSql("SELECT * FROM Action_Days WHERE IsActive=?", [true], fn);
//    });
//    app.db.transaction(function (tx) {
//        tx.executeSql("SELECT * FROM Interventions WHERE IsActive=?", [true], fn);
//    });
//    app.db.transaction(function (tx) {
//        tx.executeSql("SELECT * FROM Residents WHERE IsActive=?", [true], fn);
//    });

//};


//app.JoinedData = function (fn) {
//    app.db.transaction(function (tx) {
//        tx.executeSql("SELECT * FROM Actions a JOIN Actions_Days b ON b.ActionID=a.ID", fn, errLog);

//    });
//};


//app.GetooflineDailyDairy = function (fn) {

//    app.db.transaction(function (tx) {
//        tx.executeSql("SELECT * FROM Section_Intervention WHERE IsActive=?", [true], fn, errLog);
//    });


//};


app.multiSelect = function (db, queries) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Residents WHERE IsActive=?", [true], function (tx, result) {

        },
          function (transaction, error) {
              console.log(error);
          })
    });
}

function errLog(tx, err) {
    console.log(err);
}


////ManiSankar
//app.DeleteOfflineAdhocInterventions = function (t) {
//    app.db.transaction(function (tx) {
//        tx.executeSql("UPDATE Actions SET IsActive = ?, IsSyncnised= ? WHERE ID = ?", [false, false, t.ID], errLog);
//    });
//};

//ManiSankar
app.DeleteOfflineInterventions = function (t) {
    app.db.transaction(function (tx) {
        tx.executeSql("UPDATE  Interventions SET IsActive = ?, IsSyncnised= ? WHERE ID = ?", [false, false, t.ID], errLog);
    });
};

app.DeleteOfflineInterventions = function (t) {
    app.db.transaction(function (tx) {
        tx.executeSql("UPDATE  Interventions SET IsActive = ?, IsSyncnised= ? WHERE ID = ?", [false, false, t.ID], errLog);
    });
};

//ManiSankar
app.DeleteExistingInterventions = function (t) {
    app.db.transaction(function (tx) {
        tx.executeSql("UPDATE  Interventions SET PlannedStartDate = ?, PlannedEndDate= ?,IsSyncnised = ? WHERE ID = ?", [t.StartTime, t.EndTime, false, t.Id], errLog);
    });
};

////ManiSankar
//app.DeleteOfflineAdhocInterventions = function (t) {
//    app.db.transaction(function (tx) {
//        tx.executeSql("UPDATE Interventions SET IsActive = ?,IsSyncnised = ? WHERE ID = ?", [false, false, t], errLog);
//    });
//};

//ManiSankar
app.InsertNewadhocIntervention = function (t) {

    app.db.transaction(function (tx) {
        tx.executeSql("INSERT INTO Actions(ID,ResidentID,Section_InterventionID,StartDate,EndDate,Occurrences,Type,Interval,Instance,Month,IsAdhocIntervention,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [t.ID, t.ResidentID, t.Section_InterventionID, t.StartDate, null, t.Occurrences, t.Type, t.Interval, null, null, true, true, t.Created, t.CreatedBy, t.Modified, t.ModifiedBy, false, true]
         );
    });

    app.db.transaction(function (tx) {
        tx.executeSql("INSERT INTO Actions_Days(ID,ActionID,Day,Date,StartTime,EndTime,Specifications,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [t.Action_DaysID, t.ID, null, null, t.Action_DaysStartTime, t.Action_DaysEndTime, null, true, t.Action_DaysCreated, t.Action_DaysCreatedBy, t.Action_DaysModified, t.Action_DaysModifiedBy, false, true]
        );
    });
}


app.InsertNewDataForReccurencePatternAction_Days = function (t) {
    //app.db.transaction(function (tx) {
    //    tx.executeSql("INSERT INTO Actions_Days(ID,ActionID,Day,Date,StartTime,EndTime,Specifications,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    //      [t.Action_DaysID, t.Action_DaysAction_ID, t.Action_DaysAction_Day, t.Action_DaysAction_Date, t.Action_DaysStartTime, t.Action_DaysEndTime, null, true, t.Action_DaysCreated, t.Action_DaysCreatedBy, t.Action_DaysModified, t.Action_DaysModifiedBy, false, true], errLog);
    //});
    app.db.transaction(function (tx) {
        tx.executeSql("INSERT INTO Actions_Days(ID,Action_ID,Day,Date,StartTime,EndTime,Specifications,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [t.Action_DaysID, t.ID, t.Day, t.Date, t.Action_DaysStartTime, t.Action_DaysEndTime, null, true, t.Action_DaysCreated, t.Action_DaysCreatedBy, t.Action_DaysModified, t.Action_DaysModifiedBy, false, true]
    );
    });
};


//ManiSankar
app.InsertNewDataForReccurencePattern = function (t) {
    app.db.transaction(function (tx) {
        tx.executeSql("INSERT INTO Actions(ID,ResidentID,Section_InterventionID,StartDate,EndDate,Occurrences,Type,Interval,Instance,Month,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          [t.ID, t.ResidentID, t.Section_InterventionID, t.StartDate, t.EndDate, t.Occurrences, t.Type, t.Interval, t.Instance, t.Month, true, t.Created, t.CreatedBy, t.Modified, t.ModifiedBy, false, true]
    );
    });
    //app.db.transaction(function (tx) {
    //    tx.executeSql("INSERT INTO Actions_Days(ID,Action_ID,Day,Date,StartTime,EndTime,Specifications,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    //      [t.Action_DaysID, t.ID, t.Day, t.Date, t.Action_DaysStartTime, t.Action_DaysEndTime, null, true, t.Action_DaysCreated, t.Action_DaysCreatedBy, t.Action_DaysModified, t.Action_DaysModifiedBy, false, true]
    //);
    //});
}

//ManiSankar
app.InsertNewReccurencePattern = function (t) {
    app.db.transaction(function (tx) {
        tx.executeSql("INSERT INTO Interventions(ID,Action_DayID,PlannedStartDate,PlannedEndDate,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
         [t.InterventionsID, t.InterventionsAction_DayID, t.InterventionsPlannedStartDate, t.InterventionsPlannedEndDate, t.InterventionsIsActive, t.InterventionsCreated, t.InterventionsCreatedBy, t.InterventionsModified, t.InterventionsModifiedBy, false, true]
     );
    });
}

app.GetResidentAdhocInterventionDocuments = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM ResidentAdhocInterventionDocuments WHERE IsActive=?", [true], fn, errLog);
    });
}
//app.InsertNewadhocIntervention = function (t) {
//    app.db.transaction(function (tx) {
//        tx.executeSql("INSERT INTO Actions(ID,ResidentID,Section_InterventionID,StartDate,EndDate,Occurrences,Type,Interval,Instance,Month,IsAdhocIntervention,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",

//          [t.ID, t.ResidentID, t.Section_InterventionID, t.StartDate, null, t.Occurrences, t.Type, t.Interval, null, null, true, true, t.Created, t.CreatedBy, t.Modified, t.ModifiedBy]);

//        });

//};
////ManiSankar
//app.InsertNewadhocIntervention = function (t) {
//    app.db.transaction(function (tx) {
//        tx.executeSql("INSERT INTO Sections_Questions_Answers_Summary(ID,Section_QuestionID,Section_Question_AnswerID,SectionSummaryID,IsActive,Created,CreatedBy,Modified,ModifiedBy) VALUES (?,?,?,?,?,?,?,?,?)",

//          [t.ID, t.Section_QuestionID, t.Section_Question_AnswerID, t.SectionSummaryID, t.IsActive, t.Created, t.CreatedBy, t.Modified, t.ModifiedBy]

//    );

//    });

//}

app.selectQueryForMasterData = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Roles", [],
                      fn);
    });
}


app.UpdateAcceptAsResident = function (t) {//Samatha
    app.db.transaction(function (tx) {
        return tx.executeSql("UPDATE  Residents SET IsAccepted = ?, IsSyncnised= ? WHERE ID = ?", [true, false, t]);
    });
};

app.GetOfflineResidentAdhocInterventions = function (fn, t) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM  ResidentAdhocInterventionDocuments WHERE ID=? and IsActive=?", [t, true], fn, errLog);
    });
};


app.GetUpdatedOfflineUserLogin = function (fn, t) {//Anil 
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Login WHERE UserID=? and IsSyncnised=?", [t, false], fn, errLog);
    });
};

app.GetOfflineResidentsByID = function (fn, t) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Residents WHERE ID=? and IsActive=?", [t, true], fn, errLog);
    });
};

app.GetOfflineResidents_Questions_Answers = function (fn, t) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Residents_Questions_Answers WHERE ResidentID = ? and IsActive=?", [t, true], fn, errLog);
    });
};


app.GetOfflineSections_Questions_Answers = function (fn) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Sections_Questions_Answers WHERE  IsActive=?", [true], fn, errLog);
    });
};


app.GetOfflineSections_Questions = function (fn) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Sections_Questions WHERE  IsActive=?", [true], fn, errLog);
    });
};

app.GetOfflineSections_Questions_Answers_Tasks = function (fn) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Sections_Questions_Answers_Tasks WHERE  IsActive=?", [true], fn, errLog);
    });
};

app.GetOfflineActionsByResidentID = function (fn, t) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Actions WHERE ResidentID = ? and IsActive=?", [t, true], fn, errLog);
    });
};

app.GetOfflineSections = function (fn) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Sections WHERE  IsActive=?", [true], fn, errLog);
    });
};

app.GetOfflineSectionsIsSummary = function (fn) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Sections WHERE  IsActive=? and HasSummary=?", [true, true], fn, errLog);
    });
};


app.GetOfflineInterventionsByInterventionID = function (fn, t) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Interventions  WHERE ID = ? and IsActive=?", [t, true], fn, errLog);
    });
};


app.GetOfflineIntervention_Question_ParentQuestion = function (fn) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Intervention_Question_ParentQuestion WHERE  IsActive=?", [true], fn, errLog);
    });
};


app.GetOfflineActions_Days = function (fn) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Actions_Days WHERE  IsActive=?", [true], fn, errLog);
    });
};


app.GetOfflineIntervention_Question = function (fn) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Intervention_Question WHERE  IsActive=?", [true], fn, errLog);
    });
};


app.GetOfflineIntervention_Question_Answer = function (fn) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Intervention_Question_Answer WHERE  IsActive=?", [true], fn, errLog);
    });
};


app.GetOfflineInterventions_Resident_Answers = function (fn, t) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Interventions_Resident_Answers  WHERE InterventionID = ? and ResidentID = ? and IsActive=?", [t.InterventionID, t.ResidentID, true], fn, errLog);
    });
};

app.GetOfflineResident_Interventions_Questions_Answers = function (fn, t) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Resident_Interventions_Questions_Answers  WHERE ResidentID = ? and IsActive=?", [t, true], fn, errLog);
    });
};

app.GetOfflineIntervention_Question_Answer_Task = function (fn) {//Samatha
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Intervention_Question_Answer_Task  WHERE IsActive=?", [true], fn, errLog);
    });
};

app.GetOfflineQuestionParentQuestion = function (fn) {//nagendra
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Question_ParentQuestion WHERE IsActive=?", [true], fn, errLog);
    });
}

app.GetOfflineAdhocInterventionsActions = function (fn, t) {//Anil
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Actions WHERE ResidentID = ? and IsActive=? and IsAdhocIntervention =?", [t, true, true], fn, errLog);
    });
};

//app.insertofflineResidentssecionQuestionAnswer = function (t) {//nagendra
//    app.db.transaction(function (tx) {
//        tx.executeSql("INSERT INTO Residents_Questions_Answers(ID,ResidentID,Section_Question_AnswerID,AnswerText,IsActive,Created,CreatedBy,Modified,ModifiedBy,IsSyncnised,IsCreated) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
//        [t.ID, t.ResidentID, t.Section_Question_AnswerID, t.AnswerText, t.IsActive, t.Created, t.CreatedBy, t.Modified, t.ModifiedBy, false, true]);
//    });
//}

//app.UpdateofflineResidentQuestionAnswer = function (t) {//nagendra
//    app.db.transaction(function (tx) {
//        return tx.executeSql("UPDATE  Residents_Questions_Answers SET IsActive = ?, IsSyncnised= ? WHERE ID = ?", [false, false, t]);
//    });
//};

app.GetOfflineSections_Questions_Answers_Summary = function (fn) {//ManiSankar
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Sections_Questions_Answers_Summary WHERE IsActive=?", [true], fn, errLog);
    });
};


app.GetOfflineSection_Summary = function (fn) {//ManiSankar
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Section_Summary WHERE IsActive=?", [true], fn, errLog);
    });
};


//Code for SYN

app.GetNewOfflineResidents = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Residents WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, true, false], fn, errLog);
    });
}

app.GetOfflineResidentsNew = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Residents WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, true, false], fn, errLog);
    });
}

app.GetUpdatedOfflineResidents = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Residents WHERE  IsCreated = ? and IsSyncnised=?", [false, false], fn, errLog);
    });
}

app.GetNewOfflineActions = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Actions WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, true, false], fn, errLog);
    });
}

app.GetUpdatedOfflineActions = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Actions WHERE IsCreated = ? and IsSyncnised=?", [false, false], fn, errLog);
    });
}

app.GetNewOfflineActions_Days = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Actions_Days WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, true, false], fn, errLog);
    });
}

app.GetUpdatedOfflineActions_Days = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Actions_Days WHERE IsCreated = ? and IsSyncnised=?", [false, false], fn, errLog);
    });
}

app.GetNewOfflineInterventions = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Interventions WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, true, false], fn, errLog);
    });
}

app.GetUpdatedOfflineInterventions = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Interventions WHERE IsCreated = ? and IsSyncnised=?", [false, false], fn, errLog);
    });
}

app.GetNewOfflineInterventions_Resident_Answers = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Interventions_Resident_Answers WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, true, false], fn, errLog);
    });
}

app.GetUpdatedOfflineInterventions_Resident_Answers = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Interventions_Resident_Answers WHERE IsCreated = ? and IsSyncnised=?", [false, false], fn, errLog);
    });
}

app.GetNewOfflineResident_Interventions_Questions_Answers = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Resident_Interventions_Questions_Answers WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, true, false], fn, errLog);
    });
}

app.GetUpdatedOfflineResident_Interventions_Questions_Answers = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Resident_Interventions_Questions_Answers WHERE IsCreated = ? and IsSyncnised=?", [false, false], fn, errLog);
    });
}

app.GetNewOfflineResidents_Questions_Answers = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Residents_Questions_Answers WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, true, false], fn, errLog);
    });
}

app.GetUpdatedOfflineResidents_Questions_Answers = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM Residents_Questions_Answers WHERE IsCreated = ? and IsSyncnised=?", [false, false], fn, errLog);
    });
}

app.GetNewOfflineResidentPhotos = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM ResidentPhotos WHERE IsActive=? and IsSyncnised=?", [true, false], fn, errLog);
    });
}

app.GetUpdatedOfflineResidentPhotos = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM ResidentPhotos WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, false, false], fn, errLog);
    });
}

app.GetNewOfflineResidentDocuments = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM ResidentAnswerDocuments WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, true, false], fn, errLog);
    });
}


app.GetNewOfflineResidentAdhocIntervention = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM ResidentAdhocInterventionDocuments WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, true, false], fn, errLog);
    });
}

app.GetResidentDocuments = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM ResidentAnswerDocuments WHERE IsActive=?", [true], fn, errLog);
    });
}
app.GetInterventionResidentAnswerDocuments = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM InterventionResidentAnswerDocuments WHERE IsActive=?", [true], fn, errLog);
    });
}

app.GetNewOfflineInterventionResidentAnswerDocuments = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM InterventionResidentAnswerDocuments WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, true, false], fn, errLog);
    });
}

app.getnewofflinePainMonitoring = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM PainMonitoring WHERE IsActive=? and IsCreated = ? and IsSyncnised=?", [true, true, false], fn, errLog);
    });
}

app.GetUpdatedOfflinePainMonitoring = function (fn) {
    app.db.transaction(function (tx) {
        tx.executeSql("SELECT * FROM PainMonitoring WHERE IsCreated = ? and IsSyncnised=?", [false, false], fn, errLog);
    });
}


//END SYC