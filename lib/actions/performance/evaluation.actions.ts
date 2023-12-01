"use server"
import { attprisma } from "@/lib/db/att_db"
import { pisprisma } from "@/lib/db/pis_db"
import { catchErrorMessage } from "@/lib/utils"
import { AppraisalValidation, AppreciationValidation, EducationValidation, LeaveEvalValidation, MarksValidation, WarningValidation } from "@/lib/validations/evaluation"
import { revalidatePath } from "next/cache"

// ========================= COMMON ========================== //
export async function getAllFiscalYears() {

    try {
        const data: {
            FYEARID: number,
            FYEAR: string
        }[] = await pisprisma.$queryRaw`SELECT * FROM ENG_FYEAR_PIS ORDER BY FYEARID DESC`

        return {
            data: data,
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

export async function getCriterias(ctype: string) {

    try {
        const data: {
            CVALUE: number,
            CNAME: string
        }[] = await pisprisma.$queryRaw`SELECT CNAME, CVALUE FROM PE_CRITERIAS WHERE CTYPE = ${ctype}`

        return {
            data: data,
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

// ========================= MARKS ========================== //
export async function getAllMarks(fyearid: number) {

    try {
        const data: {
            MARKSID: number,
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            FYEARID: number,
            FYEAR: string
            HOD_Q1: number,
            HOD_Q2: number,
            HOD_Q3: number,
            HOD_Q4: number,
            HOD_Q5: number,
            HOD_Q6: number,
            HOD_Q7: number,
            HOD_Q8: number,
            HOD_Q9: number,
            HOD_Q10: number,
            TOTAL_HOD: number,
            SUP_Q1: number,
            SUP_Q2: number,
            SUP_Q3: number,
            SUP_Q4: number,
            SUP_Q5: number,
            TOTAL_SUP: number,
        }[] = await pisprisma.$queryRaw`SELECT S.STAFFNAME, S.STAFFCODE, M.*, S.STAFFID,
		(SELECT FYEAR FROM ENG_FYEAR_PIS WHERE FYEARID = M.FYEARID) FYEAR
		FROM STAFF S LEFT JOIN PE_MARKS M ON M.STAFFID = S.STAFFID AND M.FYEARID = ${fyearid}
        WHERE JOBSTATUSID = 1`

        return {
            data: data,
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

export async function createUpdateMarks(marksData: unknown) {

    try {
        const zod = MarksValidation.safeParse(marksData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            return {
                error: errorMessage
            };
        }

        const exist: {
            MARKSID: number
        }[] = await pisprisma.$queryRaw`SELECT MARKSID FROM PE_MARKS WHERE FYEARID = ${zod.data.fyearid} AND STAFFID=${zod.data.staffid}`

        const hod_tot = zod.data.hod_q1 + zod.data.hod_q2 + zod.data.hod_q3 + zod.data.hod_q4 + zod.data.hod_q5 +
            zod.data.hod_q6 + zod.data.hod_q7 + zod.data.hod_q8 + zod.data.hod_q9 + zod.data.hod_q10

        const sup_tot = zod.data.sup_q1 + zod.data.sup_q2 + zod.data.sup_q3 + zod.data.sup_q4 + zod.data.sup_q5

        // Fetch from DB
        const hod_weight: number = 70
        const sup_weight: number = 100

        const average: number = (hod_tot * (hod_weight / 100)) + (sup_tot * (sup_weight / 100)) 

        if (exist && exist[0]) {
            await pisprisma.$queryRaw`UPDATE PE_MARKS 
                    SET
                        STAFFID = ${zod.data.staffid},
                        FYEARID = ${zod.data.fyearid},
                        HOD_Q1 = ${zod.data.hod_q1},
                        HOD_Q2 = ${zod.data.hod_q2},
                        HOD_Q3 = ${zod.data.hod_q3},
                        HOD_Q4 = ${zod.data.hod_q4},
                        HOD_Q5 = ${zod.data.hod_q5},
                        HOD_Q6 = ${zod.data.hod_q6},
                        HOD_Q7 = ${zod.data.hod_q7},
                        HOD_Q8 = ${zod.data.hod_q8},
                        HOD_Q9 = ${zod.data.hod_q9},
                        HOD_Q10 = ${zod.data.hod_q10},
                        TOTAL_HOD = ${hod_tot},
                        SUP_Q1 = ${zod.data.sup_q1},
                        SUP_Q2 = ${zod.data.sup_q2},
                        SUP_Q3 = ${zod.data.sup_q3},
                        SUP_Q4 = ${zod.data.sup_q4},
                        SUP_Q5 = ${zod.data.sup_q5},
                        TOTAL_SUP = ${sup_tot}
                    WHERE MARKSID = ${exist[0].MARKSID}`
        } else {
            await pisprisma.$queryRaw`INSERT INTO PE_MARKS 
                    (
                        STAFFID,FYEARID,HOD_Q1,HOD_Q2,HOD_Q3,HOD_Q4,HOD_Q5,HOD_Q6,HOD_Q7,HOD_Q8,
                        HOD_Q9,HOD_Q10,TOTAL_HOD,SUP_Q1,SUP_Q2,SUP_Q3,SUP_Q4,SUP_Q5,TOTAL_SUP                    
                    )
                    VALUES(
                        ${zod.data.staffid},${zod.data.fyearid},${zod.data.hod_q1},${zod.data.hod_q2},
                        ${zod.data.hod_q3},${zod.data.hod_q4},${zod.data.hod_q5},${zod.data.hod_q6},
                        ${zod.data.hod_q7},${zod.data.hod_q8},${zod.data.hod_q9},${zod.data.hod_q10}, 
                        ${hod_tot},
                        ${zod.data.sup_q1},${zod.data.sup_q2},${zod.data.sup_q3},${zod.data.sup_q4},${zod.data.sup_q5},
                        ${sup_tot}
                    )`
        }

        // update yearly average
        await pisprisma.$queryRaw`MERGE PE_AVERAGE  AS tgt  
            USING (
                SELECT ${zod.data.fyearid}, ${zod.data.staffid}, ${hod_tot}, ${hod_weight}, ${sup_tot}, ${sup_weight}, ${average}
            ) AS SRC (FYEARID, STAFFID, HOD_TOTAL, HOD_WEIGHT, SUP_TOTAL, SUP_WEIGHT, AVERAGE )  
            ON (TGT.FYEARID = SRC.FYEARID AND TGT.STAFFID = SRC.STAFFID)  
            WHEN MATCHED THEN 
                UPDATE SET HOD_TOTAL = SRC.HOD_TOTAL, HOD_WEIGHT = SRC.HOD_WEIGHT, 
                    SUP_TOTAL = SRC.SUP_TOTAL, SUP_WEIGHT = SRC.SUP_WEIGHT, AVERAGE = SRC.AVERAGE
            WHEN NOT MATCHED THEN   
                INSERT (FYEARID, STAFFID, HOD_TOTAL, HOD_WEIGHT, SUP_TOTAL, SUP_WEIGHT, AVERAGE )
                VALUES (SRC.FYEARID, SRC.STAFFID, SRC.HOD_TOTAL, SRC.HOD_WEIGHT, SRC.SUP_TOTAL, SRC.SUP_WEIGHT, SRC.AVERAGE );`

        revalidatePath("/evaluation/marks")
        return

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

// ========================= AVERAGE ========================== //
type AverageData = {
    STAFFID: number
    STAFFCODE: string
    FYEARID: number
    AVERAGE: number
    STAFFNAME: string
    FYEAR: string
}

type AverageMain = {
    [key: number]: {
        STAFFID: number
        STAFFCODE: string
        FYEARID: number
        AVERAGE1: number
        AVERAGE2: number
        AVERAGE3: number
        AVERAGE4: number
        AVERAGE5: number
        AVERAGE: number
        STAFFNAME: string
        YEAR1: string
        YEAR2: string
        YEAR3: string
        YEAR4: string
        YEAR5: string
    }
}
export async function getAverageMarks(fyearid: number) {

    try {
        const years: {
            FYEARID: number,
            FYEAR: string
        }[] = await pisprisma.$queryRaw`SELECT TOP(5)* FROM ENG_FYEAR_PIS WHERE FYEARID <= ${fyearid} ORDER BY FYEARID DESC`

        // YEAR 1 //
        const year1: AverageData[] = await pisprisma.$queryRaw`SELECT S.STAFFCODE, S.STAFFNAME, A.*, S.STAFFID 
                FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
                WHERE S.JOBSTATUSID = 1 AND FYEARID = ${fyearid}`

        let final: AverageMain = []

        year1.forEach(res => {
            final[res.STAFFID] = {
                STAFFID: res.STAFFID,
                STAFFCODE: res.STAFFCODE,
                FYEARID: res.FYEARID,
                AVERAGE1: res.AVERAGE,
                AVERAGE2: 0,
                AVERAGE3: 0,
                AVERAGE4: 0,
                AVERAGE5: 0,
                AVERAGE: res.AVERAGE,
                STAFFNAME: res.STAFFNAME,
                YEAR1: years[0].FYEAR,
                YEAR2: "",
                YEAR3: "",
                YEAR4: "",
                YEAR5: "",
            }
        });

        if (years[1].FYEARID) {
            // YEAR 2 //
            const year2: AverageData[] = await pisprisma.$queryRaw`SELECT A.AVERAGE, S.STAFFID 
                    FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
                    WHERE S.JOBSTATUSID = 1 AND FYEARID = ${years[1].FYEARID}`

            year2.forEach(res => {
                final[res.STAFFID].AVERAGE2 = res.AVERAGE
                final[res.STAFFID].YEAR2 = years[1].FYEAR
                if (res.AVERAGE && res.AVERAGE > 0) {
                    final[res.STAFFID].AVERAGE = (final[res.STAFFID].AVERAGE + res.AVERAGE) / 2
                }
            });
        }


        if (years[2].FYEARID) {
            // YEAR 3 //
            const year3: AverageData[] = await pisprisma.$queryRaw`SELECT A.AVERAGE, S.STAFFID 
                    FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
                    WHERE S.JOBSTATUSID = 1 AND FYEARID = ${years[2].FYEARID}`

            year3.forEach(res => {
                final[res.STAFFID].AVERAGE3 = res.AVERAGE
                final[res.STAFFID].YEAR3 = years[2].FYEAR
                if (res.AVERAGE && res.AVERAGE > 0) {
                    final[res.STAFFID].AVERAGE = (final[res.STAFFID].AVERAGE + res.AVERAGE) / 2
                }
            });
        }

        if (years[3].FYEARID) {
            // YEAR 4 //
            const year4: AverageData[] = await pisprisma.$queryRaw`SELECT A.AVERAGE, S.STAFFID 
                    FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
                    WHERE S.JOBSTATUSID = 1 AND FYEARID = ${years[3].FYEARID}`

            year4.forEach(res => {
                final[res.STAFFID].AVERAGE4 = res.AVERAGE
                final[res.STAFFID].YEAR4 = years[3].FYEAR
                if (res.AVERAGE && res.AVERAGE > 0) {
                    final[res.STAFFID].AVERAGE = (final[res.STAFFID].AVERAGE + res.AVERAGE) / 2
                }
            });
        }

        if (years[4].FYEARID) {
            // YEAR 5 //
            const year5: AverageData[] = await pisprisma.$queryRaw`SELECT A.AVERAGE, S.STAFFID 
                    FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
                    WHERE S.JOBSTATUSID = 1 AND FYEARID = ${years[4].FYEARID}`

            year5.forEach(res => {
                final[res.STAFFID].AVERAGE5 = res.AVERAGE
                final[res.STAFFID].YEAR5 = years[4].FYEAR
                if (res.AVERAGE && res.AVERAGE > 0) {
                    final[res.STAFFID].AVERAGE = (final[res.STAFFID].AVERAGE + res.AVERAGE) / 2
                }
            });
        }

        console.log()

        return {
            data: Object.values(final),
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

// ========================= SERVICE ========================== //
export async function getServicePeriod(fyearid: number) {
    try {
        const data: {
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            LAST_APPRAISAL: string
            POINTS: number
        }[] = await pisprisma.$queryRaw`SELECT S.STAFFNAME, S.STAFFCODE, 
                (SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID) DEPARTMENT, 
                (SELECT POSITIONNAME FROM STAFFPOSITION WHERE POSITIONID = S.POSITIONID) DESIGNATION,
                (SELECT FYEAR FROM ENG_FYEAR_PIS WHERE FYEARID = A.FYEARID) LAST_APPRAISAL,
                (
                    CASE WHEN ISNULL(A.FYEARID,'') = 0 THEN 0 
                    WHEN ${fyearid} - A.FYEARID > 10 THEN 10
                    ELSE ${fyearid} - A.FYEARID END ) POINTS
                FROM STAFF S LEFT JOIN PE_APPRAISAL A ON A.STAFFID = S.STAFFID
                WHERE S.JOBSTATUSID = 1`

        return {
            data: data,
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

// ========================= APPRAISAL ========================== //
export async function getAppraisals() {
    try {
        const data: {
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            APPRAISALID: number
            FYEARID: number
            LAST_APPRAISAL: string
        }[] = await pisprisma.$queryRaw`SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID,
                (SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID) DEPARTMENT, 
                (SELECT POSITIONNAME FROM STAFFPOSITION WHERE POSITIONID = S.POSITIONID) DESIGNATION,
                A.APPRAISALID, A.FYEARID,
                (CASE WHEN ISNULL(A.FYEARID,'') = '' THEN 'NA' ELSE  
                (SELECT FYEAR FROM ENG_FYEAR_PIS WHERE FYEARID = A.FYEARID ) END ) LAST_APPRAISAL
                FROM STAFF S LEFT JOIN PE_APPRAISAL A ON A.STAFFID = S.STAFFID
                WHERE S.JOBSTATUSID = 1`

        return {
            data: data,
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}
export async function createUpdateAppraisal(formData: unknown) {

    try {
        const zod = AppraisalValidation.safeParse(formData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            return {
                error: errorMessage
            };
        }

        await pisprisma.$queryRaw`MERGE PE_APPRAISAL AS tgt  
            USING (
                SELECT ${zod.data.fyearid}, ${zod.data.staffid}
            ) AS SRC (FYEARID, STAFFID)  
            ON (TGT.STAFFID = SRC.STAFFID)  
            WHEN MATCHED THEN 
                UPDATE SET FYEARID = SRC.FYEARID
            WHEN NOT MATCHED THEN   
                INSERT (FYEARID, STAFFID)
                VALUES (SRC.FYEARID, SRC.STAFFID);`


        revalidatePath("/evaluation/appraisal")
        return

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

// ========================= Education ========================== //
export async function getEducationRecord(fyearid: number) {
    try {
        const data: {
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            FYEARID: number
            QUALIFICATION: string
            FYEAR: string
        }[] = await pisprisma.$queryRaw`SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID,
        (SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID) DEPARTMENT,
        (SELECT POSITIONNAME FROM STAFFPOSITION WHERE POSITIONID = S.POSITIONID) DESIGNATION,
        (
        	SELECT (
        		CASE WHEN ISNULL(AP.FYEARID,'') = '' THEN '~'
        		ELSE (
        			SELECT FYEAR FROM ENG_FYEAR_PIS
        			WHERE FYEARID = AP.FYEARID
        		) END
        	) FROM PE_EDUCATION AP
        	WHERE AP.STAFFID = S.STAFFID
        	AND AP.FYEARID = ${fyearid}
        ) FYEAR, 
        (
        	SELECT QUALIFICATION FROM PE_EDUCATION AP 
        	WHERE AP.STAFFID = S.STAFFID
        	AND AP.FYEARID = ${fyearid}
        ) QUALIFICATION, ${fyearid} FYEARID
        FROM STAFF S
        WHERE S.JOBSTATUSID = 1`

        return {
            data: data,
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

export async function createUpdateEducation(formData: unknown) {

    try {
        const zod = EducationValidation.safeParse(formData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            return {
                error: errorMessage
            };
        }

        let points = 5;
        if (zod.data.qualification == "UNDER") {
            points = 0
        } else if (zod.data.qualification == "OVER") {
            points = 10
        }

        await pisprisma.$queryRaw`MERGE PE_EDUCATION AS tgt  
            USING (
                SELECT ${zod.data.fyearid}, ${zod.data.staffid}, ${zod.data.qualification}, ${points}
            ) AS SRC (FYEARID, STAFFID, QUALIFICATION, POINTS)  
            ON (TGT.STAFFID = SRC.STAFFID AND TGT.FYEARID = SRC.FYEARID)  
            WHEN MATCHED THEN 
                UPDATE SET QUALIFICATION = SRC.QUALIFICATION, POINTS = SRC.POINTS
            WHEN NOT MATCHED THEN   
                INSERT (FYEARID, STAFFID, QUALIFICATION, POINTS) 
                VALUES (SRC.FYEARID, SRC.STAFFID, SRC.QUALIFICATION, SRC.POINTS);`

        // revalidatePath("/evaluation/education")
        return

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}


// ========================= Administration: Leaves ========================== //
export async function getLeaveEvalRecord(fyearid: number) {
    try {
        const data: {
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            FYEARID: number
            CATEGORY: string
            FYEAR: string
        }[] = await pisprisma.$queryRaw`SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID,
        (SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID) DEPARTMENT,
        (SELECT POSITIONNAME FROM STAFFPOSITION WHERE POSITIONID = S.POSITIONID) DESIGNATION,
        (
        	SELECT (
        		CASE WHEN ISNULL(AP.FYEARID,'') = '' THEN '~'
        		ELSE (
        			SELECT FYEAR FROM ENG_FYEAR_PIS
        			WHERE FYEARID = AP.FYEARID
        		) END
        	) FROM PE_LEAVEEVAL AP
        	WHERE AP.STAFFID = S.STAFFID
        	AND AP.FYEARID = ${fyearid}
        ) FYEAR, 
        (
        	SELECT CATEGORY FROM PE_LEAVEEVAL AP 
        	WHERE AP.STAFFID = S.STAFFID
        	AND AP.FYEARID = ${fyearid}
        ) CATEGORY, ${fyearid} FYEARID
        FROM STAFF S
        WHERE S.JOBSTATUSID = 1`

        return {
            data: data,
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

export async function createUpdateAnnualLeaveData(formData: unknown) {

    try {
        const zod = LeaveEvalValidation.safeParse(formData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            return {
                error: errorMessage
            };
        }

        await pisprisma.$queryRaw`MERGE PE_LEAVEEVAL AS tgt  
            USING (
                SELECT ${zod.data.fyearid}, ${zod.data.staffid}, ${zod.data.category}, ${zod.data.point}
            ) AS SRC (FYEARID, STAFFID, CATEGORY, POINTS)  
            ON (TGT.STAFFID = SRC.STAFFID AND TGT.FYEARID = SRC.FYEARID)  
            WHEN MATCHED THEN 
                UPDATE SET CATEGORY = SRC.CATEGORY, POINTS = SRC.POINTS
            WHEN NOT MATCHED THEN   
                INSERT (FYEARID, STAFFID, CATEGORY, POINTS) 
                VALUES (SRC.FYEARID, SRC.STAFFID, SRC.CATEGORY, SRC.POINTS);`

        // revalidatePath("/evaluation/leave")
        return

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

// ========================= Administration: Appreciation ========================== //
export async function getAppreciationRecord(fyearid: number) {
    try {
        const data: {
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            FYEARID: number
            CATEGORY: string
            FYEAR: string
        }[] = await pisprisma.$queryRaw`SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID,
        (SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID) DEPARTMENT,
        (SELECT POSITIONNAME FROM STAFFPOSITION WHERE POSITIONID = S.POSITIONID) DESIGNATION,
        (
        	SELECT (
        		CASE WHEN ISNULL(AP.FYEARID,'') = '' THEN '~'
        		ELSE (
        			SELECT FYEAR FROM ENG_FYEAR_PIS
        			WHERE FYEARID = AP.FYEARID
        		) END
        	) FROM PE_APPRECIATION AP
        	WHERE AP.STAFFID = S.STAFFID
        	AND AP.FYEARID = ${fyearid}
        ) FYEAR, 
        (
        	SELECT CATEGORY FROM PE_APPRECIATION AP 
        	WHERE AP.STAFFID = S.STAFFID
        	AND AP.FYEARID = ${fyearid}
        ) CATEGORY, ${fyearid} FYEARID
        FROM STAFF S
        WHERE S.JOBSTATUSID = 1`

        return {
            data: data,
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

export async function createUpdateAppreciation(formData: unknown) {

    try {
        const zod = AppreciationValidation.safeParse(formData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            return {
                error: errorMessage
            };
        }

        await pisprisma.$queryRaw`MERGE PE_APPRECIATION AS tgt  
            USING (
                SELECT ${zod.data.fyearid}, ${zod.data.staffid}, ${zod.data.category}, ${zod.data.point}
            ) AS SRC (FYEARID, STAFFID, CATEGORY, POINTS)  
            ON (TGT.STAFFID = SRC.STAFFID AND TGT.FYEARID = SRC.FYEARID)  
            WHEN MATCHED THEN 
                UPDATE SET CATEGORY = SRC.CATEGORY, POINTS = SRC.POINTS
            WHEN NOT MATCHED THEN   
                INSERT (FYEARID, STAFFID, CATEGORY, POINTS) 
                VALUES (SRC.FYEARID, SRC.STAFFID, SRC.CATEGORY, SRC.POINTS);`

        // revalidatePath("/evaluation/appreciation")
        return

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

// ========================= Administration: Warning ========================== //
export async function getWarningRecord(fyearid: number) {
    try {
        const data: {
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            FYEARID: number
            CATEGORY: string
            FYEAR: string
        }[] = await pisprisma.$queryRaw`SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID,
        (SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID) DEPARTMENT,
        (SELECT POSITIONNAME FROM STAFFPOSITION WHERE POSITIONID = S.POSITIONID) DESIGNATION,
        (
        	SELECT (
        		CASE WHEN ISNULL(AP.FYEARID,'') = '' THEN '~'
        		ELSE (
        			SELECT FYEAR FROM ENG_FYEAR_PIS
        			WHERE FYEARID = AP.FYEARID
        		) END
        	) FROM PE_WARNING AP
        	WHERE AP.STAFFID = S.STAFFID
        	AND AP.FYEARID = ${fyearid}
        ) FYEAR, 
        (
        	SELECT CATEGORY FROM PE_WARNING AP 
        	WHERE AP.STAFFID = S.STAFFID
        	AND AP.FYEARID = ${fyearid}
        ) CATEGORY, ${fyearid} FYEARID
        FROM STAFF S
        WHERE S.JOBSTATUSID = 1`

        return {
            data: data,
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

export async function createUpdateWarning(formData: unknown) {

    try {
        const zod = WarningValidation.safeParse(formData)
        if (!zod.success) {

            let errorMessage = "";

            zod.error.issues.forEach((issue) => {
                errorMessage = errorMessage + "[" + issue.path[0] + "]: " + issue.message + "."
            })
            return {
                error: errorMessage
            };
        }

        await pisprisma.$queryRaw`MERGE PE_WARNING AS tgt  
            USING (
                SELECT ${zod.data.fyearid}, ${zod.data.staffid}, ${zod.data.category}, ${zod.data.point}
            ) AS SRC (FYEARID, STAFFID, CATEGORY, POINTS)  
            ON (TGT.STAFFID = SRC.STAFFID AND TGT.FYEARID = SRC.FYEARID)  
            WHEN MATCHED THEN 
                UPDATE SET CATEGORY = SRC.CATEGORY, POINTS = SRC.POINTS
            WHEN NOT MATCHED THEN   
                INSERT (FYEARID, STAFFID, CATEGORY, POINTS) 
                VALUES (SRC.FYEARID, SRC.STAFFID, SRC.CATEGORY, SRC.POINTS);`

        // revalidatePath("/evaluation/warning")
        return

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

// ========================= Administration: Total ========================== //

type AdminvgData = {
    [key: number]: {
        STAFFID: number
        STAFFCODE: string
        DEPARTMENT: string
        DESIGNATION: string
        STAFFNAME: string
        ATTENDANCE: number
        APPRECIATION: number
        WARNING: number
    }
}

export async function getAdminAverage(fyearid: number) {

    try {

        const attendance: {
            STAFFID: number
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            POINTS: number
        }[] = await pisprisma.$queryRaw`SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID,
        (SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID) DEPARTMENT,
        (SELECT POSITIONNAME FROM STAFFPOSITION WHERE POSITIONID = S.POSITIONID) DESIGNATION, 
        (
        	SELECT POINTS FROM PE_LEAVEEVAL AP 
        	WHERE AP.STAFFID = S.STAFFID
        	AND AP.FYEARID = ${fyearid}
        ) POINTS
        FROM STAFF S
        WHERE S.JOBSTATUSID = 1`

        let data: AdminvgData = []

        attendance.forEach(res => {
            data[res.STAFFID] = {
                STAFFID: res.STAFFID,
                STAFFCODE: res.STAFFCODE,
                DEPARTMENT: res.DEPARTMENT,
                DESIGNATION: res.DESIGNATION,
                STAFFNAME: res.STAFFNAME,
                ATTENDANCE: res.POINTS,
                APPRECIATION: 0,
                WARNING: 0,
            }
        });

        const appreciation: {
            STAFFID: number
            AVERAGE: number
        }[] = await pisprisma.$queryRaw`SELECT SUM( ISNULL(POINTS,0)  ) AVERAGE, STAFFID
        FROM (    
            SELECT A.*, (
            	CASE WHEN ${fyearid} - ISNULL(LAST_APPRAISAL,0) < 3 THEN (LAST_APPRAISAL + 1)  
            	ELSE ${fyearid} - 2 END
            ) SUM_FROM      
                FROM (
                SELECT APP.* ,(
                	SELECT ( CASE WHEN FYEARID > 0 THEN FYEARID ELSE 0 END ) FROM PE_APPRAISAL
                	WHERE STAFFID = APP.STAFFID
                ) LAST_APPRAISAL FROM PE_APPRECIATION APP
            ) A
        )B WHERE FYEARID BETWEEN SUM_FROM AND ${fyearid} 
        GROUP BY STAFFID`

        appreciation.forEach(res => {
            data[res.STAFFID].APPRECIATION = res.AVERAGE
        });


        const warning: {
            STAFFID: number
            AVERAGE: number
        }[] = await pisprisma.$queryRaw`SELECT SUM( ISNULL(POINTS,0)  ) AVERAGE, STAFFID
        FROM (    
            SELECT A.*, (
            	CASE WHEN ${fyearid} - ISNULL(LAST_APPRAISAL,0) < 3 THEN (LAST_APPRAISAL + 1)  
            	ELSE ${fyearid} - 2 END
            ) SUM_FROM      
                FROM (
                SELECT APP.* ,(
                	SELECT ( CASE WHEN FYEARID > 0 THEN FYEARID ELSE 0 END ) FROM PE_APPRAISAL
                	WHERE STAFFID = APP.STAFFID
                ) LAST_APPRAISAL FROM PE_WARNING APP
            ) A
        )B WHERE FYEARID BETWEEN SUM_FROM AND ${fyearid} 
        GROUP BY STAFFID`

        warning.forEach(res => {
            data[res.STAFFID].WARNING = res.AVERAGE
        });

        return {
            data: Object.values(data),
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

// ========================= FINAL ========================== //
type FinalData = {
    STAFFID: number
    STAFFCODE: string
    DEPARTMENT: string
    DESIGNATION: string
    FYEARID: number
    AVERAGE: number
    STAFFNAME: string
    FYEAR: string
    SERVICE: number
    EDUCATION: number
    ATTENDANCE: number
    APPRECIATION: number
    WARNING: number
}

type FinalMain = {
    [key: number]: {
        STAFFID: number
        STAFFCODE: string
        DEPARTMENT: string
        DESIGNATION: string
        FYEARID: number
        AVERAGE1: number
        AVERAGE2: number
        AVERAGE3: number
        AVERAGE4: number
        AVERAGE5: number
        AVERAGE: number
        STAFFNAME: string
        YEAR1: string
        YEAR2: string
        YEAR3: string
        YEAR4: string
        YEAR5: string
        SERVICE: number
        EDUCATION: number
        ATTENDANCE: number
        APPRECIATION: number
        WARNING: number
    }
}
export async function getFinalRecord(fyearid: number) {

    try {
        const years: {
            FYEARID: number,
            FYEAR: string
        }[] = await pisprisma.$queryRaw`SELECT TOP(5)* FROM ENG_FYEAR_PIS WHERE FYEARID <= ${fyearid} ORDER BY FYEARID DESC`

        // YEAR 1 //
        const year1: FinalData[] = await pisprisma.$queryRaw`SELECT S.STAFFCODE, S.STAFFNAME, A.*, S.STAFFID,
                (SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID) DEPARTMENT, 
                (SELECT POSITIONNAME FROM STAFFPOSITION WHERE POSITIONID = S.POSITIONID) DESIGNATION,
                (
                    SELECT (
                        CASE WHEN ISNULL(AP.FYEARID,'') = 0 THEN 0
                        WHEN ${fyearid} - AP.FYEARID > 10 THEN 10
                        ELSE ${fyearid} - AP.FYEARID END 
                    ) FROM PE_APPRAISAL AP 
                    WHERE AP.STAFFID = S.STAFFID
                ) SERVICE,
                (
                    SELECT (
                        CASE WHEN ISNULL(POINTS,0) = 0 THEN 0
                        ELSE POINTS END
                    ) FROM PE_EDUCATION
                    WHERE FYEARID = ${fyearid} AND STAFFID = S.STAFFID
                ) EDUCATION,
                (
                    SELECT (
                        CASE WHEN ISNULL(POINTS,0) = 0 THEN 0
                        ELSE POINTS END
                    ) FROM PE_LEAVEEVAL
                    WHERE FYEARID = ${fyearid} AND STAFFID = S.STAFFID
                ) ATTENDANCE,
                (
                    SELECT (
                        CASE WHEN ISNULL(POINTS,0) = 0 THEN 0
                        ELSE POINTS END
                    ) FROM PE_APPRECIATION
                    WHERE FYEARID = ${fyearid} AND STAFFID = S.STAFFID
                ) APPRECIATION,
                (
                    SELECT (
                        CASE WHEN ISNULL(POINTS,0) = 0 THEN 0
                        ELSE POINTS END
                    ) FROM PE_WARNING
                    WHERE FYEARID = ${fyearid} AND STAFFID = S.STAFFID
                ) WARNING
                FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
                WHERE S.JOBSTATUSID = 1 AND FYEARID = ${fyearid}`

        let final: FinalMain = []

        year1.forEach(res => {
            final[res.STAFFID] = {
                STAFFID: res.STAFFID,
                STAFFCODE: res.STAFFCODE,
                DEPARTMENT: res.DEPARTMENT,
                DESIGNATION: res.DESIGNATION,
                FYEARID: res.FYEARID,
                AVERAGE1: res.AVERAGE,
                AVERAGE2: 0,
                AVERAGE3: 0,
                AVERAGE4: 0,
                AVERAGE5: 0,
                AVERAGE: res.AVERAGE,
                STAFFNAME: res.STAFFNAME,
                YEAR1: years[0].FYEAR,
                YEAR2: "",
                YEAR3: "",
                YEAR4: "",
                YEAR5: "",
                SERVICE: res.SERVICE,
                EDUCATION: res.EDUCATION,
                ATTENDANCE: res.ATTENDANCE,
                APPRECIATION: res.APPRECIATION,
                WARNING: res.WARNING
            }
        });

        if (years[1].FYEARID) {
            // YEAR 2 //
            const year2: AverageData[] = await pisprisma.$queryRaw`SELECT A.AVERAGE, S.STAFFID 
                    FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
                    WHERE S.JOBSTATUSID = 1 AND FYEARID = ${years[1].FYEARID}`

            year2.forEach(res => {
                final[res.STAFFID].AVERAGE2 = res.AVERAGE
                final[res.STAFFID].YEAR2 = years[1].FYEAR
                if (res.AVERAGE && res.AVERAGE > 0) {
                    final[res.STAFFID].AVERAGE = (final[res.STAFFID].AVERAGE + res.AVERAGE) / 2
                }
            });
        }


        if (years[2].FYEARID) {
            // YEAR 3 //
            const year3: AverageData[] = await pisprisma.$queryRaw`SELECT A.AVERAGE, S.STAFFID 
                    FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
                    WHERE S.JOBSTATUSID = 1 AND FYEARID = ${years[2].FYEARID}`

            year3.forEach(res => {
                final[res.STAFFID].AVERAGE3 = res.AVERAGE
                final[res.STAFFID].YEAR3 = years[2].FYEAR
                if (res.AVERAGE && res.AVERAGE > 0) {
                    final[res.STAFFID].AVERAGE = (final[res.STAFFID].AVERAGE + res.AVERAGE) / 2
                }
            });
        }

        if (years[3].FYEARID) {
            // YEAR 4 //
            const year4: AverageData[] = await pisprisma.$queryRaw`SELECT A.AVERAGE, S.STAFFID 
                    FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
                    WHERE S.JOBSTATUSID = 1 AND FYEARID = ${years[3].FYEARID}`

            year4.forEach(res => {
                final[res.STAFFID].AVERAGE4 = res.AVERAGE
                final[res.STAFFID].YEAR4 = years[3].FYEAR
                if (res.AVERAGE && res.AVERAGE > 0) {
                    final[res.STAFFID].AVERAGE = (final[res.STAFFID].AVERAGE + res.AVERAGE) / 2
                }
            });
        }

        if (years[4].FYEARID) {
            // YEAR 5 //
            const year5: AverageData[] = await pisprisma.$queryRaw`SELECT A.AVERAGE, S.STAFFID 
                    FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
                    WHERE S.JOBSTATUSID = 1 AND FYEARID = ${years[4].FYEARID}`

            year5.forEach(res => {
                final[res.STAFFID].AVERAGE5 = res.AVERAGE
                final[res.STAFFID].YEAR5 = years[4].FYEAR
                if (res.AVERAGE && res.AVERAGE > 0) {
                    final[res.STAFFID].AVERAGE = (final[res.STAFFID].AVERAGE + res.AVERAGE) / 2
                }
            });
        }

        return {
            data: Object.values(final),
            error: ""
        }

    } catch (error) {
        return {
            data: [],
            error: catchErrorMessage(error)
        }
    }

}

