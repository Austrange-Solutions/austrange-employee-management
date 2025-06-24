export interface Attendance {
    _id: string;
    user: string;
    dateOfWorking: string;
    dayOfWeek: string;
    loginTime: string;
    breakDuration: number;
    startLatitude: number;
    startLongitude: number;
    workingHoursCompleted: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    breakStartTime?: string;
    breakEndTime?: string;
    endLatitude?: number;
    endLongitude?: number;
    logoutTime?: string;
}