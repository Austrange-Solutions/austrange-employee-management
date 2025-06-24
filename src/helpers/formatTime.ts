const formatTime = (timestamp: string | number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

export default formatTime;