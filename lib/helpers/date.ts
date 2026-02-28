const formatDate = (date: any) => {
  if (!date) return "N/A";
  const d = new Date(date?.$date || date);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short", 
    year: "numeric"
  });
};

export default formatDate;