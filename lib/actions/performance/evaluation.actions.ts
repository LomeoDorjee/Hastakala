"use server"
import { attprisma } from "@/lib/db/att_db"
import { pisprisma } from "@/lib/db/pis_db"
import { catchErrorMessage } from "@/lib/utils"
import { AppraisalValidation, AppreciationValidation, EducationValidation, LeaveEvalValidation, MarksValidation, WarningValidation } from "@/lib/validations/evaluation"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { sessionUser } from "../config/user.actions"

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

        let sql = `SELECT * FROM PE_CRITERIAS`
        if (ctype != "ALL") {
            sql += ` WHERE CTYPE = ${ctype} `
        }
        sql += ` ORDER BY CRITERIAID `

        const data: {
            CRITERIAID: number
            CVALUE: number
            CNAME: string
            CTYPE: string
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

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
export async function getAllMarks(sessionUser: sessionUser, fyearid: number) {

    try {

        let sql = `SELECT S.STAFFNAME, S.STAFFCODE, M.*, S.STAFFID,
		(SELECT FYEAR FROM ENG_FYEAR_PIS WHERE FYEARID = M.FYEARID) FYEAR
		FROM STAFF S LEFT JOIN PE_MARKS M ON M.STAFFID = S.STAFFID AND M.FYEARID = ${fyearid}
        WHERE JOBSTATUSID = 1`

        if (!['ADMIN', 'MANAGEMENT'].includes(sessionUser.usertype)) {
            sql += ` AND S.STAFFID IN ( SELECT STAFFID FROM PE_INCHARGE WHERE UNDERID = ${sessionUser.staffid})`
        }

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
            SUP_Q6: number,
            SUP_Q7: number,
            SUP_Q8: number,
            SUP_Q9: number,
            SUP_Q10: number,
            TOTAL_HOD: number,
            SUP_Q1: number,
            SUP_Q2: number,
            SUP_Q3: number,
            SUP_Q4: number,
            SUP_Q5: number,
            TOTAL_SUP: number,
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

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

export async function createUpdateMarks(marksData: unknown, sessionUser: sessionUser) {

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

        const weight: {
            HOD_WEIGHT: number
            SUP_WEIGHT: number
        }[] = await pisprisma.$queryRaw`SELECT * FROM PE_WEIGHT`

        const hod_weight: number = weight[0].HOD_WEIGHT
        const sup_weight: number = weight[0].SUP_WEIGHT

        const exist: {
            MARKSID: number
            TOTAL_HOD: number
            TOTAL_SUP: number
        }[] = await pisprisma.$queryRaw`SELECT MARKSID, TOTAL_SUP, TOTAL_HOD FROM PE_MARKS WHERE FYEARID = ${zod.data.fyearid} AND STAFFID=${zod.data.staffid}`

        let sup_tot = zod.data.sup_q1 + zod.data.sup_q2 + zod.data.sup_q3 + zod.data.sup_q4 + zod.data.sup_q5 +
            zod.data.sup_q6 + zod.data.sup_q7 + zod.data.sup_q8 + zod.data.sup_q9 + zod.data.sup_q10

        let hod_tot = zod.data.hod_q1 + zod.data.hod_q2 + zod.data.hod_q3 + zod.data.hod_q4 + zod.data.hod_q5


        // if (sessionUser.usertype == "HOD") {
        //     if (exist && exist[0]) {
        //         await pisprisma.$queryRaw`UPDATE PE_MARKS 
        //                 SET
        //                     HOD_Q1 = ${zod.data.hod_q1},
        //                     HOD_Q2 = ${zod.data.hod_q2},
        //                     HOD_Q3 = ${zod.data.hod_q3},
        //                     HOD_Q4 = ${zod.data.hod_q4},
        //                     HOD_Q5 = ${zod.data.hod_q5},
        //                     TOTAL_HOD = ${hod_tot}
        //                 WHERE MARKSID = ${exist[0].MARKSID}`

        //         sup_tot = exist[0].TOTAL_SUP
        //     } else {
        //         await pisprisma.$queryRaw`INSERT INTO PE_MARKS 
        //                 (
        //                     STAFFID,FYEARID,HOD_Q1,HOD_Q2,HOD_Q3,HOD_Q4,HOD_Q5,TOTAL_HOD                    
        //                 )
        //                 VALUES(
        //                     ${zod.data.staffid},${zod.data.fyearid},${zod.data.hod_q1},${zod.data.hod_q2},
        //                     ${zod.data.hod_q3},${zod.data.hod_q4},${zod.data.hod_q5},
        //                     ${hod_tot}
        //                 )`
        //     }
        // } else if (sessionUser.usertype == "SUPERVISOR") {
        //     if (exist && exist[0]) {
        //         await pisprisma.$queryRaw`UPDATE PE_MARKS 
        //                 SET
        //                     SUP_Q1 = ${zod.data.sup_q1},
        //                     SUP_Q2 = ${zod.data.sup_q2},
        //                     SUP_Q3 = ${zod.data.sup_q3},
        //                     SUP_Q4 = ${zod.data.sup_q4},
        //                     SUP_Q5 = ${zod.data.sup_q5},
        //                     SUP_Q6 = ${zod.data.sup_q6},
        //                     SUP_Q7 = ${zod.data.sup_q7},
        //                     SUP_Q8 = ${zod.data.sup_q8},
        //                     SUP_Q9 = ${zod.data.sup_q9},
        //                     SUP_Q10 = ${zod.data.sup_q10},
        //                     TOTAL_SUP = ${sup_tot}
        //                 WHERE MARKSID = ${exist[0].MARKSID}`

        //         hod_tot = exist[0].TOTAL_HOD
        //     } else {
        //         await pisprisma.$queryRaw`INSERT INTO PE_MARKS 
        //                 (
        //                     STAFFID,FYEARID,SUP_Q1,SUP_Q2,SUP_Q3,SUP_Q4,SUP_Q5,
        //                     SUP_Q6,SUP_Q7,SUP_Q8,SUP_Q9,SUP_Q10,TOTAL_SUP                    
        //                 )
        //                 VALUES(
        //                     ${zod.data.staffid},${zod.data.fyearid},
        //                     ${zod.data.sup_q1},${zod.data.sup_q2},${zod.data.sup_q3},${zod.data.sup_q4},${zod.data.sup_q5},
        //                     ${zod.data.sup_q6},${zod.data.sup_q7},${zod.data.sup_q8},${zod.data.sup_q9},${zod.data.sup_q10},
        //                     ${sup_tot}
        //                 )`
        //     }
        // } else {

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
                            SUP_Q6 = ${zod.data.sup_q6},
                            SUP_Q7 = ${zod.data.sup_q7},
                            SUP_Q8 = ${zod.data.sup_q8},
                            SUP_Q9 = ${zod.data.sup_q9},
                            SUP_Q10 = ${zod.data.sup_q10},
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
                            STAFFID,FYEARID,HOD_Q1,HOD_Q2,HOD_Q3,HOD_Q4,HOD_Q5,SUP_Q6,SUP_Q7,SUP_Q8,
                            SUP_Q9,SUP_Q10,TOTAL_HOD,SUP_Q1,SUP_Q2,SUP_Q3,SUP_Q4,SUP_Q5,TOTAL_SUP
                        )
                        VALUES(
                            ${zod.data.staffid},${zod.data.fyearid},${zod.data.hod_q1},${zod.data.hod_q2},
                            ${zod.data.hod_q3},${zod.data.hod_q4},${zod.data.hod_q5},${zod.data.sup_q6},
                            ${zod.data.sup_q7},${zod.data.sup_q8},${zod.data.sup_q9},${zod.data.sup_q10}, 
                            ${hod_tot},
                            ${zod.data.sup_q1},${zod.data.sup_q2},${zod.data.sup_q3},${zod.data.sup_q4},${zod.data.sup_q5},
                            ${sup_tot}
                        )`
            }

        // }

        const average: number = (hod_tot * (hod_weight / 100)) + (sup_tot * (sup_weight / 100)) 

        // update yearly average
        await pisprisma.$queryRaw`MERGE PE_AVERAGE  AS tgt  
            USING (
                SELECT ${zod.data.fyearid}, ${zod.data.staffid}, ${hod_tot}, ${hod_weight}, ${sup_tot}, ${sup_weight}, ${average.toFixed(2)}
            ) AS SRC (FYEARID, STAFFID, HOD_TOTAL, HOD_WEIGHT, SUP_TOTAL, SUP_WEIGHT, AVERAGE )  
            ON (TGT.FYEARID = SRC.FYEARID AND TGT.STAFFID = SRC.STAFFID)  
            WHEN MATCHED THEN 
                UPDATE SET HOD_TOTAL = SRC.HOD_TOTAL, HOD_WEIGHT = SRC.HOD_WEIGHT, 
                    SUP_TOTAL = SRC.SUP_TOTAL, SUP_WEIGHT = SRC.SUP_WEIGHT, AVERAGE = SRC.AVERAGE
            WHEN NOT MATCHED THEN   
                INSERT (FYEARID, STAFFID, HOD_TOTAL, HOD_WEIGHT, SUP_TOTAL, SUP_WEIGHT, AVERAGE )
                VALUES (SRC.FYEARID, SRC.STAFFID, SRC.HOD_TOTAL, SRC.HOD_WEIGHT, SRC.SUP_TOTAL, SRC.SUP_WEIGHT, SRC.AVERAGE );`

        // revalidatePath("/evaluation/marks")
        return {
            error: ""
        }

    } catch (error) {
        return {
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
        YEARSTAKEN: number
    }
}
export async function getAverageMarks(fyearid: number, sessionUser: sessionUser) {

    try {
        const years: {
            FYEARID: number,
            FYEAR: string
        }[] = await pisprisma.$queryRaw`SELECT TOP(5)* FROM ENG_FYEAR_PIS WHERE FYEARID <= ${fyearid} ORDER BY FYEARID DESC`


        let sql = `SELECT S.STAFFCODE, S.STAFFNAME, A.*, S.STAFFID 
                    FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
                    WHERE S.JOBSTATUSID = 1 AND FYEARID = ${fyearid}`

        let toJoin = ``
        if (!["ADMIN", "MANAGEMENT"].includes(sessionUser.usertype)) {
            sql += ` AND S.STAFFID IN (SELECT STAFFID FROM PE_INCHARGE WHERE UNDERID = ${sessionUser.staffid})`
            toJoin = ` AND S.STAFFID IN (SELECT STAFFID FROM PE_INCHARGE WHERE UNDERID = ${sessionUser.staffid})`
        }

        // YEAR 1 //
        const year1: AverageData[] = await pisprisma.$queryRaw(Prisma.raw(sql))

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
                YEARSTAKEN: 0
            }
        });

        if (years[1].FYEARID) {
            // YEAR 2 //
            sql = `SELECT A.AVERAGE, S.STAFFID 
            FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
            WHERE S.JOBSTATUSID = 1 AND FYEARID = ${years[1].FYEARID}` + toJoin
            const year2: AverageData[] = await pisprisma.$queryRaw(Prisma.raw(sql))

            year2.forEach(res => {
                final[res.STAFFID].AVERAGE2 = res.AVERAGE
                final[res.STAFFID].YEAR2 = years[1].FYEAR
            });
        }


        if (years[2].FYEARID) {
            // YEAR 3 //
            sql = `SELECT A.AVERAGE, S.STAFFID 
            FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
            WHERE S.JOBSTATUSID = 1 AND FYEARID = ${years[2].FYEARID}` + toJoin
            const year3: AverageData[] = await pisprisma.$queryRaw(Prisma.raw(sql))

            year3.forEach(res => {
                final[res.STAFFID].AVERAGE3 = res.AVERAGE
                final[res.STAFFID].YEAR3 = years[2].FYEAR
            });
        }

        if (years[3].FYEARID) {
            // YEAR 4 //
            sql = `SELECT A.AVERAGE, S.STAFFID 
            FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
            WHERE S.JOBSTATUSID = 1 AND FYEARID = ${years[3].FYEARID}` + toJoin
            const year4: AverageData[] = await pisprisma.$queryRaw(Prisma.raw(sql))

            year4.forEach(res => {
                final[res.STAFFID].AVERAGE4 = res.AVERAGE
                final[res.STAFFID].YEAR4 = years[3].FYEAR
            });
        }

        if (years[4].FYEARID) {
            // YEAR 5 //
            sql = `SELECT A.AVERAGE, S.STAFFID 
            FROM STAFF S INNER JOIN PE_AVERAGE A ON S.STAFFID = A.STAFFID 
            WHERE S.JOBSTATUSID = 1 AND FYEARID = ${years[4].FYEARID}` + toJoin

            const year5: AverageData[] = await pisprisma.$queryRaw(Prisma.raw(sql))

            year5.forEach(res => {
                final[res.STAFFID].AVERAGE5 = res.AVERAGE
                final[res.STAFFID].YEAR5 = years[4].FYEAR
            });
        }


        // Average Calculation 

        sql = `SELECT * FROM PE_APPRAISAL S WHERE 1=1 ` + toJoin

        // Get Last Appraisal
        const appraisals: {
            FYEARID: number
            STAFFID: number
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

        appraisals.forEach((val) => {

            let year_since_la = fyearid - val.FYEARID

            if (final[val.STAFFID]) {

                final[val.STAFFID].YEARSTAKEN = year_since_la

                if (final[val.STAFFID].STAFFCODE.substring(0, 2) == "P1") {
                    // STAFF
                    if (year_since_la >= 3) {

                        final[val.STAFFID].YEARSTAKEN = 3

                        // TAKE 3 YEARS AVERAGE : 40% - 35% & 25%
                        final[val.STAFFID].AVERAGE =
                            (final[val.STAFFID].AVERAGE1 * 0.4) +
                            (final[val.STAFFID].AVERAGE2 * 0.35) +
                            (final[val.STAFFID].AVERAGE3 * 0.25)
                    } else {

                        final[val.STAFFID].YEARSTAKEN = year_since_la

                        // TAKE AVERAGE of years after appraisal
                        let summation = 0
                        for (let i = 0; i < year_since_la; i++) {
                            summation += eval('final[val.STAFFID].AVERAGE' + (i + 1))
                        }
                        final[val.STAFFID].AVERAGE = summation / year_since_la
                    }
                } else {
                    // PRODUCER
                    if (year_since_la > 5) {

                        final[val.STAFFID].YEARSTAKEN = 5

                        // TAKE 5 YEARS AVERAGE 
                        final[val.STAFFID].AVERAGE =
                            (
                                final[val.STAFFID].AVERAGE1 +
                                final[val.STAFFID].AVERAGE2 +
                                final[val.STAFFID].AVERAGE3 +
                                final[val.STAFFID].AVERAGE4 +
                                final[val.STAFFID].AVERAGE5
                            ) / 5
                    } else {

                        final[val.STAFFID].YEARSTAKEN = year_since_la

                        // TAKE AVERAGE of years after appraisal
                        let summation = 0
                        for (let i = 0; i < year_since_la; i++) {
                            summation += eval('final[val.STAFFID].AVERAGE' + (i + 1))
                        }
                        final[val.STAFFID].AVERAGE = summation / year_since_la
                    }
                }

                final[val.STAFFID].AVERAGE = final[val.STAFFID].AVERAGE.toFixed(2) as unknown as number

            }

        })

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
export async function getServicePeriod(fyearid: number, sessionUser: sessionUser) {
    try {

        let sql = `SELECT S.STAFFNAME, S.STAFFCODE, 
        (SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID) DEPARTMENT, 
        (SELECT POSITIONNAME FROM STAFFPOSITION WHERE POSITIONID = S.POSITIONID) DESIGNATION,
        (SELECT FYEAR FROM ENG_FYEAR_PIS WHERE FYEARID = A.FYEARID) LAST_APPRAISAL,
        (
            CASE WHEN ISNULL(A.FYEARID,'') = 0 THEN 0 
            WHEN ${fyearid} - A.FYEARID > 10 THEN 10
            ELSE ${fyearid} - A.FYEARID END ) POINTS
        FROM STAFF S LEFT JOIN PE_APPRAISAL A ON A.STAFFID = S.STAFFID
        WHERE S.JOBSTATUSID = 1`

        if (!["ADMIN", "MANAGEMENT"].includes(sessionUser.usertype)) {
            sql += ` AND S.STAFFID IN (SELECT STAFFID FROM PE_INCHARGE WHERE UNDERID = ${sessionUser.staffid})`
        }

        const data: {
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            LAST_APPRAISAL: string
            POINTS: number
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

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
export async function getAppraisals(sessionUser: sessionUser) {
    try {

        let sql = `SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID,
                    (SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID) DEPARTMENT, 
                    (SELECT POSITIONNAME FROM STAFFPOSITION WHERE POSITIONID = S.POSITIONID) DESIGNATION,
                    A.APPRAISALID, A.FYEARID,
                    (CASE WHEN ISNULL(A.FYEARID,'') = '' THEN 'NA' ELSE  
                    (SELECT FYEAR FROM ENG_FYEAR_PIS WHERE FYEARID = A.FYEARID ) END ) LAST_APPRAISAL
                    FROM STAFF S LEFT JOIN PE_APPRAISAL A ON A.STAFFID = S.STAFFID
                    WHERE S.JOBSTATUSID = 1`

        if (!["ADMIN", "MANAGEMENT"].includes(sessionUser.usertype)) {
            sql += ` AND S.STAFFID IN (SELECT STAFFID FROM PE_INCHARGE WHERE UNDERID = ${sessionUser.staffid})`
        }

        const data: {
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            APPRAISALID: number
            FYEARID: number
            LAST_APPRAISAL: string
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

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


        // revalidatePath("/evaluation/appraisal")
        return {
            error: ""
        }

    } catch (error) {
        return {
            error: catchErrorMessage(error)
        }
    }

}

// ========================= Education ========================== //
export async function getEducationRecord(fyearid: number, sessionUser: sessionUser) {
    try {

        let sql = `SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID,
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

        if (!["ADMIN", "MANAGEMENT"].includes(sessionUser.usertype)) {
            sql += ` AND S.STAFFID IN (SELECT STAFFID FROM PE_INCHARGE WHERE UNDERID = ${sessionUser.staffid})`
        }
        const data: {
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            FYEARID: number
            QUALIFICATION: string
            FYEAR: string
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

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
        return {
            error: ""
        }

    } catch (error) {
        return {
            error: catchErrorMessage(error)
        }
    }

}

export async function populateEducationData(fyearid: number) {

    try {


        await pisprisma.$queryRaw`MERGE PE_EDUCATION AS tgt  
            USING (
                SELECT MAX( POINTS) POINTS, STAFFID,
                MAX(QUALIFICATION) QUALIFICATION, ${fyearid} FYEARID 
                FROM PE_EDUCATION 
                GROUP BY STAFFID
            ) AS SRC (POINTS, STAFFID, QUALIFICATION, FYEARID)  
            ON (TGT.STAFFID = SRC.STAFFID AND TGT.FYEARID = SRC.FYEARID)
            WHEN NOT MATCHED THEN   
                INSERT (FYEARID, STAFFID, QUALIFICATION, POINTS) 
                VALUES (SRC.FYEARID, SRC.STAFFID, SRC.QUALIFICATION, SRC.POINTS);`

        return {
            status: "success",
            message: "Data Populated!"
        }

    } catch (error) {
        return {
            status: "error",
            message: catchErrorMessage(error)
        }
    }

}




// ========================= Administration: Leaves ========================== //
export async function getLeaveEvalRecord(fyearid: number, sessionUser: sessionUser) {
    try {
        let sql = `SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID,
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

        if (!["ADMIN", "MANAGEMENT"].includes(sessionUser.usertype)) {
            sql += ` AND S.STAFFID IN (SELECT STAFFID FROM PE_INCHARGE WHERE UNDERID = ${sessionUser.staffid})`
        }

        const data: {
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            FYEARID: number
            CATEGORY: string
            FYEAR: string
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

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
        return {
            error: ""
        }

    } catch (error) {
        return {
            error: catchErrorMessage(error)
        }
    }

}


export async function populateLeave(num: number, fyearid: number) {

    try {

        let category = "LESS THAN 13"
        let point = 15

        if (num == 1) {
            category = "MORE THAN 31.5 WITH LOP"
            point = 0
        }

        await pisprisma.$queryRaw`MERGE PE_LEAVEEVAL AS tgt  
            USING (
                SELECT ${fyearid} FYEARID, STAFFID, ${category}, ${point}
                FROM STAFF WHERE JOBSTATUSID = 1
            ) AS SRC (FYEARID, STAFFID, CATEGORY, POINTS)  
            ON (TGT.STAFFID = SRC.STAFFID AND TGT.FYEARID = SRC.FYEARID)  
            WHEN MATCHED THEN 
                UPDATE SET CATEGORY = SRC.CATEGORY, POINTS = SRC.POINTS
            WHEN NOT MATCHED THEN   
                INSERT (FYEARID, STAFFID, CATEGORY, POINTS) 
                VALUES (SRC.FYEARID, SRC.STAFFID, SRC.CATEGORY, SRC.POINTS);`

        return {
            error: ""
        }

    } catch (error) {
        return {
            error: catchErrorMessage(error)
        }
    }

}
// ========================= Administration: Appreciation ========================== //
export async function getAppreciationRecord(fyearid: number, sessionUser: sessionUser) {
    try {

        let sql = `SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID,
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

        if (!["ADMIN", "MANAGEMENT"].includes(sessionUser.usertype)) {
            sql += ` AND S.STAFFID IN (SELECT STAFFID FROM PE_INCHARGE WHERE UNDERID = ${sessionUser.staffid})`
        }
        const data: {
            STAFFID: number,
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            FYEARID: number
            CATEGORY: string
            FYEAR: string
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

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
        return {
            error: ""
        }

    } catch (error) {
        return {
            error: catchErrorMessage(error)
        }
    }

}

// ========================= Administration: Warning ========================== //
export async function getWarningRecord(fyearid: number, sessionUser: sessionUser) {
    try {
        let sql = `SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID,
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

        if (!["ADMIN", "MANAGEMENT"].includes(sessionUser.usertype)) {
            sql += ` AND S.STAFFID IN (SELECT STAFFID FROM PE_INCHARGE WHERE UNDERID = ${sessionUser.staffid})`
        }

        const data: {
            STAFFID: number
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            FYEARID: number
            CATEGORY: string
            FYEAR: string
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

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
        return {
            error: ""
        }

    } catch (error) {
        return {
            error: catchErrorMessage(error)
        }
    }

}

export async function populateWarning(num: number, fyearid: number) {

    try {

        let category = "TWO OR MORE"
        let point = 0

        if (num == 0) {
            category = "NONE"
            point = 2.5
        } else if (num == 1) {
            category = "ONE"
            point = 1
        }

        await pisprisma.$queryRaw`MERGE PE_WARNING AS tgt  
            USING (
                SELECT ${fyearid} FYEARID, STAFFID, ${category}, ${point}
                FROM STAFF WHERE JOBSTATUSID = 1
            ) AS SRC (FYEARID, STAFFID, CATEGORY, POINTS)  
            ON (TGT.STAFFID = SRC.STAFFID AND TGT.FYEARID = SRC.FYEARID)
            WHEN MATCHED THEN 
                UPDATE SET CATEGORY = SRC.CATEGORY, POINTS = SRC.POINTS
            WHEN NOT MATCHED THEN   
                INSERT (FYEARID, STAFFID, CATEGORY, POINTS) 
                VALUES (SRC.FYEARID, SRC.STAFFID, SRC.CATEGORY, SRC.POINTS);`

        return {
            error: ""
        }

    } catch (error) {
        return {
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

export async function getAdminAverage(fyearid: number, sessionUser: sessionUser) {

    try {

        let sql = `SELECT S.STAFFNAME, S.STAFFCODE, S.STAFFID, S.ISSUPPORT,
                    (SELECT DEPARTMENTNAME FROM PISDEPARTMENT WHERE DEPARTMENTID = S.DEPARTMENTID) DEPARTMENT,
                    (SELECT POSITIONNAME FROM STAFFPOSITION WHERE POSITIONID = S.POSITIONID) DESIGNATION, 
                    (
                        SELECT POINTS FROM PE_LEAVEEVAL AP 
                        WHERE AP.STAFFID = S.STAFFID
                        AND AP.FYEARID = ${fyearid}
                    ) POINTS
                    FROM STAFF S
                    WHERE S.JOBSTATUSID = 1`

        if (!["ADMIN", "MANAGEMENT"].includes(sessionUser.usertype)) {
            sql += ` AND S.STAFFID IN (SELECT STAFFID FROM PE_INCHARGE WHERE UNDERID = ${sessionUser.staffid})`
        }

        const attendance: {
            STAFFID: number
            STAFFNAME: string
            STAFFCODE: string
            DEPARTMENT: string
            DESIGNATION: string
            POINTS: number
            ISSUPPORT: boolean
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

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

        // ================== Appreciation ==================== //

        sql = `SELECT SUM( ISNULL(POINTS,0)  ) AVERAGE, STAFFID
                FROM (    
                    SELECT A.*, (
                        CASE WHEN ${fyearid} - ISNULL(LAST_APPRAISAL,0) < 
                        (
                            CASE WHEN 
                                (SELECT SUBSTRING(STAFFCODE,1,3) FROM STAFF WHERE STAFFID = A.STAFFID) = 'P1-' 
                                AND 
                                (SELECT ISSUPPORT FROM STAFF WHERE STAFFID = A.STAFFID) = 0 
                            THEN 3 
                            ELSE 5 END 
                        )
                        THEN (LAST_APPRAISAL + 1)  
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

        const appreciation: {
            STAFFID: number
            AVERAGE: number
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

        appreciation.forEach(res => {
            if (data[res.STAFFID])
                data[res.STAFFID].APPRECIATION = res.AVERAGE
        });

        // ================== Warning ==================== //
        sql = `SELECT SUM( ISNULL(POINTS,0)  ) AVERAGE, STAFFID
                FROM (    
                    SELECT A.*, (
                        CASE WHEN ${fyearid} - ISNULL(LAST_APPRAISAL,0) < 
                        (
                            CASE WHEN 
                                (SELECT SUBSTRING(STAFFCODE,1,3) FROM STAFF WHERE STAFFID = A.STAFFID) = 'P1-' 
                                AND 
                                (SELECT ISSUPPORT FROM STAFF WHERE STAFFID = A.STAFFID) = 0 
                            THEN 3 
                            ELSE 5 END 
                        )
                        THEN (LAST_APPRAISAL + 1)  
                        ELSE ${fyearid} - 2 END
                    ) SUM_FROM      
                        FROM (
                        SELECT APP.* ,(
                            SELECT ( CASE WHEN FYEARID > 0 THEN FYEARID ELSE 0 END ) FROM PE_APPRAISAL
                            WHERE STAFFID = APP.STAFFID
                        ) LAST_APPRAISAL FROM PE_WARNING APP`
        if (!["ADMIN", "MANAGEMENT"].includes(sessionUser.usertype)) {
            sql += ` WHERE APP.STAFFID IN (SELECT STAFFID FROM PE_INCHARGE WHERE UNDERID = ${sessionUser.staffid})`
        }
        sql += `    ) A
                )B WHERE FYEARID BETWEEN SUM_FROM AND ${fyearid} 
                GROUP BY STAFFID`
        const warning: {
            STAFFID: number
            AVERAGE: number
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

        warning.forEach(res => {
            if (data[res.STAFFID])
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
        YEARSTAKEN: number
        ISELIGIBLE: string
        ADMINTOTAL: number
        GRANDTOTAL: number
        LASTPROMOTION: string
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
                ) ATTENDANCE
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
                APPRECIATION: 0,
                WARNING: 0,
                YEARSTAKEN: 0,
                ISELIGIBLE: "",
                ADMINTOTAL: 0,
                GRANDTOTAL: 0,
                LASTPROMOTION: ""
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
            });
        }

        // Average Calculation
        let sql = `SELECT A.*, (SELECT FYEAR FROM ENG_FYEAR_PIS WHERE FYEARID = A.FYEARID) FYEAR FROM PE_APPRAISAL A `

        const appraisals: {
            FYEARID: number
            STAFFID: number
            FYEAR: string
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

        appraisals.forEach((val) => {

            let year_since_la = fyearid - val.FYEARID

            if (final[val.STAFFID]) {

                final[val.STAFFID].YEARSTAKEN = year_since_la

                final[val.STAFFID].LASTPROMOTION = val.FYEAR

                if (final[val.STAFFID].STAFFCODE.substring(0, 2) == "P1") {
                    // STAFF
                    if (year_since_la >= 3) {

                        final[val.STAFFID].YEARSTAKEN = 3

                        // TAKE 3 YEARS AVERAGE : 40% - 35% & 25%
                        final[val.STAFFID].AVERAGE =
                            (final[val.STAFFID].AVERAGE1 * 0.4) +
                            (final[val.STAFFID].AVERAGE2 * 0.35) +
                            (final[val.STAFFID].AVERAGE3 * 0.25)
                    } else {

                        final[val.STAFFID].YEARSTAKEN = year_since_la

                        // TAKE AVERAGE of years after appraisal
                        let summation = 0
                        for (let i = 0; i < year_since_la; i++) {
                            summation += eval('final[val.STAFFID].AVERAGE' + (i + 1))
                        }
                        final[val.STAFFID].AVERAGE = summation / year_since_la
                    }
                } else {
                    // PRODUCER
                    if (year_since_la > 5) {

                        final[val.STAFFID].YEARSTAKEN = 5

                        // TAKE 5 YEARS AVERAGE 
                        final[val.STAFFID].AVERAGE =
                            (
                                final[val.STAFFID].AVERAGE1 +
                                final[val.STAFFID].AVERAGE2 +
                                final[val.STAFFID].AVERAGE3 +
                                final[val.STAFFID].AVERAGE4 +
                                final[val.STAFFID].AVERAGE5
                            ) / 5
                    } else {

                        final[val.STAFFID].YEARSTAKEN = year_since_la

                        // TAKE AVERAGE of years after appraisal
                        let summation = 0
                        for (let i = 0; i < year_since_la; i++) {
                            summation += eval('final[val.STAFFID].AVERAGE' + (i + 1))
                        }
                        final[val.STAFFID].AVERAGE = summation / year_since_la
                    }
                }

            }

        })

        // ================== Appreciation ==================== //
        sql = `SELECT SUM( ISNULL(POINTS,0)  ) AVERAGE, STAFFID
                FROM (    
                    SELECT A.*, (
                        CASE WHEN ${fyearid} - ISNULL(LAST_APPRAISAL,0) < 
                        (
                            CASE WHEN 
                                (SELECT SUBSTRING(STAFFCODE,1,3) FROM STAFF WHERE STAFFID = A.STAFFID) = 'P1-' 
                                AND 
                                (SELECT ISSUPPORT FROM STAFF WHERE STAFFID = A.STAFFID) = 0 
                            THEN 3 
                            ELSE 5 END 
                        )
                        THEN (LAST_APPRAISAL + 1)  
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
        const appreciation: {
            STAFFID: number
            AVERAGE: number
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

        appreciation.forEach(res => {
            if (final[res.STAFFID])
                final[res.STAFFID].APPRECIATION = res.AVERAGE
        });

        // ================== Warning ==================== //
        sql = `SELECT SUM( ISNULL(POINTS,0)  ) AVERAGE, STAFFID
                FROM (    
                    SELECT A.*, (
                        CASE WHEN ${fyearid} - ISNULL(LAST_APPRAISAL,0) < 
                        (
                            CASE WHEN 
                                (SELECT SUBSTRING(STAFFCODE,1,3) FROM STAFF WHERE STAFFID = A.STAFFID) = 'P1-' 
                                AND 
                                (SELECT ISSUPPORT FROM STAFF WHERE STAFFID = A.STAFFID) = 0 
                            THEN 3 
                            ELSE 5 END 
                        )
                        THEN (LAST_APPRAISAL + 1)  
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
        const warning: {
            STAFFID: number
            AVERAGE: number
        }[] = await pisprisma.$queryRaw(Prisma.raw(sql))

        warning.forEach(res => {
            if (final[res.STAFFID])
                final[res.STAFFID].WARNING = res.AVERAGE
        });

        // ================== Eligibility ==================== //
        const eligibility: {
            ETYPE: string
            VALUE: number
        }[] = await pisprisma.$queryRaw`SELECT * FROM PE_ELIGIBILITY ORDER BY ELIGIBLEID`

        const min_service_period = eligibility[0].VALUE
        const max_leave_taken = eligibility[1].VALUE

        const fiscal_year = years[0].FYEAR

        const start_date = fiscal_year.substring(0, 4) + "/04/01"
        const end_date = fiscal_year.substring(5) + "/03/33"

        // == LEAVE TAKEN == //
        const taken: {
            STAFFID: number
            TAKEN: number
        }[] = await pisprisma.$queryRaw`SELECT STAFFID, (
                SELECT SUM(TOTTAKENLEAVE)
                FROM LEAVETAKEN
                WHERE STATUS = 'A' 
                AND DATEVS BETWEEN ${start_date} AND ${end_date}
                AND STAFFID = S.STAFFID
            ) TAKEN
            FROM STAFF S 
            WHERE JOBSTATUSID = 1
            ORDER BY STAFFID`

        taken.forEach(e => {
            if (final[e.STAFFID]) {

                final[e.STAFFID].ISELIGIBLE = "Eligible"

                if (final[e.STAFFID].SERVICE < min_service_period) {

                    final[e.STAFFID].ISELIGIBLE = `Service Period less than ${min_service_period}`

                } else if (e.TAKEN > max_leave_taken) {

                    final[e.STAFFID].ISELIGIBLE = `Leave Taken Greater than ${max_leave_taken}`
                }

                // Admin Total Calculation
                final[e.STAFFID].ADMINTOTAL = final[e.STAFFID].APPRECIATION + final[e.STAFFID].WARNING + final[e.STAFFID].ATTENDANCE

                // Admin Total Calculation
                final[e.STAFFID].GRANDTOTAL =
                    final[e.STAFFID].APPRECIATION +
                    final[e.STAFFID].WARNING +
                    final[e.STAFFID].ATTENDANCE +
                    final[e.STAFFID].EDUCATION +
                    final[e.STAFFID].SERVICE
                final[e.STAFFID].AVERAGE
            }
        });

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