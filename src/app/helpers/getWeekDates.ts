

const getWeekDates = () => {
    const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

        // Calculate the start of the week (Sunday)
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - dayOfWeek);
        startDate.setHours(0, 0, 0, 0); // Set to start of the day

        // Calculate the end of the week (Saturday)
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999); // Set to end of the day

        return {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };
}

export default getWeekDates;

