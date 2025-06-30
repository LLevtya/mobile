import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F4F7", // light neutral background
  },

  profileMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  memberSince: {
    fontSize: 14,
    color: "#6B7280", // slate gray
  },

  editButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E7FF", // light blue background
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  editButtonText: {
    color: "#1D4ED8", // strong blue
    marginLeft: 6,
    fontSize: 14,
    fontWeight: "500",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937", // dark text
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 20,
  },

  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  actionText: {
    fontSize: 16,
    marginLeft: 12,
    color: "#111827", // almost black
    fontWeight: "500",
  },
  profileHeader: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#FFFFFF",
  padding: 20,
  margin: 16,
  borderRadius: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  elevation: 2,
},

profileImage: {
  width: 64,
  height: 64,
  borderRadius: 32,
  marginRight: 16,
  backgroundColor: "#E5E7EB", // light gray fallback
},

profileInfo: {
  flex: 1,
},

username: {
  fontSize: 18,
  fontWeight: "600",
  color: "#111827", // almost black
  marginBottom: 4,
},
logoutButton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#F87171", // soft red
  paddingVertical: 14,
  borderRadius: 12,
  marginHorizontal: 16,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,
},

logoutButtonText: {
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: "600",
},

email: {
  fontSize: 14,
  color: "#6B7280", // muted gray
},


  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  statBox: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1D4ED8", // strong blue
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280", // slate gray
  },
});

export default styles;
