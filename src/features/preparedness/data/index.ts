import type { ChecklistItem, PreparednessProfile, PreparednessProfileOption } from "../types";

export const PROFILE_OPTIONS: PreparednessProfileOption[] = [
  {
    id: "STUDENT",
    label: "Student",
    shortLabel: "Student",
    description: "Classes, modules, exams, deadlines, devices, and internet.",
  },
  {
    id: "OFFICE_WORKER",
    label: "Office Worker / Employee",
    shortLabel: "Worker",
    description: "Work devices, files, meetings, transport, and team updates.",
  },
  {
    id: "REMOTE_WORKER",
    label: "Remote Worker / Freelancer",
    shortLabel: "Remote",
    description: "Meetings, laptop power, backups, hotspot, and client deadlines.",
  },
  {
    id: "HOUSEHOLD",
    label: "Household / Parent",
    shortLabel: "Household",
    description: "Home routines, lighting, water, food, family, and safety.",
  },
  {
    id: "BUSINESS",
    label: "Business Owner / Store Staff",
    shortLabel: "Business",
    description: "Staff, customers, refrigeration, payments, records, and equipment.",
  },
  {
    id: "TOURIST",
    label: "Tourist / Traveler",
    shortLabel: "Tourist",
    description: "Hotel, charging, bookings, offline maps, transport, and cash.",
  },
  {
    id: "SENIOR_CAREGIVER",
    label: "Senior / Caregiver",
    shortLabel: "Caregiver",
    description: "Contacts, assistance, lighting, water, meals, and essential devices.",
  },
  {
    id: "COMMUTER_DRIVER",
    label: "Commuter / Driver",
    shortLabel: "Commuter",
    description: "Routes, phone battery, navigation, payment options, and extra travel time.",
  },
  {
    id: "CUSTOM",
    label: "Other / Custom",
    shortLabel: "Custom",
    description: "Build a flexible checklist around your own situation.",
  },
];

export const PROFILE_LABELS: Record<PreparednessProfile, string> = PROFILE_OPTIONS.reduce(
  (labels, option) => ({ ...labels, [option.id]: option.shortLabel }),
  {} as Record<PreparednessProfile, string>
);

export const PROFILE_CHECKLISTS: Record<PreparednessProfile, ChecklistItem[]> = {
  STUDENT: [
    { id: "student-charge", section: "DO_FIRST", label: "Charge phone, laptop, tablet, and power bank.", detail: "Prioritize the devices you need for classes, exams, and school communication." },
    { id: "student-download", section: "DO_FIRST", label: "Download notes, modules, readings, and assignments.", detail: "Keep the files available offline before Wi-Fi or power becomes unreliable." },
    { id: "student-links", section: "BEFORE", label: "Screenshot class links, exam details, and deadlines.", detail: "Save meeting links, LMS pages, and submission instructions where you can open them without internet." },
    { id: "student-files", section: "BEFORE", label: "Save important school files locally.", detail: "Make sure drafts and references are synced or copied onto the device you will use." },
    { id: "student-data", section: "BEFORE", label: "Prepare mobile data or backup connection if available.", detail: "Test hotspot settings and keep load/data balance ready if you depend on online access." },
    { id: "student-notify", section: "DURING", label: "Notify classmates or instructor early if the outage overlaps class or exam time.", detail: "Send a short message while you still have enough battery and signal." },
    { id: "student-study-place", section: "DURING", label: "Use a quiet backup study location if necessary.", detail: "Move only if it is practical and the destination is not also affected." },
    { id: "student-sync", section: "AFTER", label: "Sync finished school work when power and internet return.", detail: "Upload drafts, confirm submissions, and reopen missed class messages." },
  ],
  OFFICE_WORKER: [
    { id: "office-charge", section: "DO_FIRST", label: "Charge phone and work devices.", detail: "Keep laptop, headset, phone, and work authenticator available." },
    { id: "office-save", section: "DO_FIRST", label: "Save and sync important files before the outage.", detail: "Upload work in progress while power and internet are stable." },
    { id: "office-download", section: "BEFORE", label: "Download files needed offline.", detail: "Keep documents, spreadsheets, and references available locally." },
    { id: "office-meetings", section: "BEFORE", label: "Check whether meetings overlap the interruption.", detail: "Flag calls that need rescheduling, relocation, or a mobile data backup." },
    { id: "office-team", section: "DURING", label: "Update supervisor or team if work may be affected.", detail: "Send one clear status message with your availability and backup plan." },
    { id: "office-transport", section: "DURING", label: "Prepare transport and mobile connectivity if relocation is necessary.", detail: "Move early enough to avoid losing time during the outage window." },
    { id: "office-equipment", section: "AFTER", label: "Reconnect and check powered work equipment carefully.", detail: "Confirm internet, monitors, and peripherals are stable before resuming critical work." },
  ],
  REMOTE_WORKER: [
    { id: "remote-charge", section: "DO_FIRST", label: "Fully charge laptop, phone, and backup batteries.", detail: "Start with the devices that keep meetings and client communication alive." },
    { id: "remote-save", section: "DO_FIRST", label: "Save active work and push or sync important changes.", detail: "Do this before power or internet drops." },
    { id: "remote-hotspot", section: "BEFORE", label: "Prepare hotspot or mobile data.", detail: "Check signal, data balance, charger, and tethering settings." },
    { id: "remote-download", section: "BEFORE", label: "Download documents and references needed offline.", detail: "Keep client briefs, docs, assets, and tickets on your device." },
    { id: "remote-deadlines", section: "BEFORE", label: "Check meetings, client calls, and deadlines against the outage window.", detail: "Move the riskiest commitments first." },
    { id: "remote-alt-workspace", section: "DURING", label: "Use an alternative workspace if needed.", detail: "Pick a verified safer location when available and bring chargers/cables together." },
    { id: "remote-sync", section: "AFTER", label: "Sync offline work and confirm messages after power returns.", detail: "Close the loop with clients or teammates before assuming everything uploaded." },
  ],
  HOUSEHOLD: [
    { id: "home-charge", section: "DO_FIRST", label: "Charge phones, lights, fans, and power banks.", detail: "Prioritize shared devices and anything used for communication." },
    { id: "home-lighting", section: "DO_FIRST", label: "Prepare flashlights or emergency lights.", detail: "Place them where people can reach them safely in the dark." },
    { id: "home-water", section: "BEFORE", label: "Prepare drinking water if an electric pump may be affected.", detail: "Keep enough for the expected outage window plus a small buffer." },
    { id: "home-contacts", section: "BEFORE", label: "Save emergency and family contact numbers.", detail: "Make them available offline and visible to household members." },
    { id: "home-fridge", section: "DURING", label: "Minimize opening the refrigerator or freezer.", detail: "Group what you need first so cold air stays inside." },
    { id: "home-children", section: "DURING", label: "Prepare activities and safe lighting for children or family members.", detail: "Keep walkways clear and lighting steady." },
    { id: "home-reconnect", section: "AFTER", label: "Check sensitive electronics before normal use.", detail: "Reconnect carefully and confirm appliances are behaving normally." },
  ],
  BUSINESS: [
    { id: "biz-staff", section: "DO_FIRST", label: "Inform staff of the outage schedule.", detail: "Make sure opening, closing, and handoff plans are clear." },
    { id: "biz-charge", section: "DO_FIRST", label: "Charge business phones, tablets, and payment devices.", detail: "Prioritize devices used for orders, delivery, and customer contact." },
    { id: "biz-payments", section: "BEFORE", label: "Prepare manual or offline order and payment fallback.", detail: "Keep receipt, cash, and order logs ready if digital systems are affected." },
    { id: "biz-refrigeration", section: "BEFORE", label: "Review refrigeration and temperature-sensitive inventory exposure.", detail: "Plan what must stay closed, moved, or sold first." },
    { id: "biz-records", section: "BEFORE", label: "Save business records and sync important systems.", detail: "Back up sales, bookings, and inventory changes before the outage." },
    { id: "biz-customers", section: "DURING", label: "Inform customers if hours or services change.", detail: "Use simple wording and avoid promising restoration times unless verified." },
    { id: "biz-restart", section: "AFTER", label: "Restart powered equipment and payment systems carefully.", detail: "Confirm internet, POS, and refrigeration are stable before full operation." },
  ],
  TOURIST: [
    { id: "tourist-charge", section: "DO_FIRST", label: "Fully charge phone, power bank, camera, and travel devices.", detail: "Your phone may be your map, ticket, contact list, and translator." },
    { id: "tourist-maps", section: "DO_FIRST", label: "Download offline maps for the area.", detail: "Save routes around your hotel, airport, port, venue, and destination." },
    { id: "tourist-bookings", section: "BEFORE", label: "Screenshot bookings, tickets, hotel details, and addresses.", detail: "Keep confirmation numbers and addresses available without signal." },
    { id: "tourist-cash", section: "BEFORE", label: "Keep some cash available.", detail: "Electronic payments, ATMs, or terminals may be unavailable in affected places." },
    { id: "tourist-hotel", section: "BEFORE", label: "Ask accommodation staff about backup power and access procedures.", detail: "Confirm elevator, gate, room key, and charging options." },
    { id: "tourist-transport", section: "DURING", label: "Plan transport before the outage window if possible.", detail: "Traffic signals or services may be affected in some areas." },
    { id: "tourist-confirm", section: "AFTER", label: "Recheck bookings, messages, and transport updates.", detail: "Confirm any delayed messages once connection is stable." },
  ],
  SENIOR_CAREGIVER: [
    { id: "care-charge", section: "DO_FIRST", label: "Charge communication devices and emergency lights.", detail: "Keep phones and lights accessible to the person who needs them most." },
    { id: "care-contacts", section: "DO_FIRST", label: "Keep essential contacts readily available.", detail: "Save numbers offline and write down key contacts if useful." },
    { id: "care-basics", section: "BEFORE", label: "Prepare water, meals, lighting, and cooling or ventilation alternatives.", detail: "Keep guidance general and safety-focused." },
    { id: "care-devices", section: "BEFORE", label: "Check that essential powered equipment has an appropriate backup plan.", detail: "Do not attempt electrical repair; contact qualified support if equipment is critical." },
    { id: "care-assist", section: "DURING", label: "Arrange assistance if mobility or accessibility may be affected.", detail: "Coordinate early while phones and signal are available." },
    { id: "care-pathways", section: "DURING", label: "Keep pathways safely lit and clear.", detail: "Reduce trip hazards before rooms get dark." },
    { id: "care-recover", section: "AFTER", label: "Confirm devices, lights, and communication are stable.", detail: "Check comfort and contacts again when power returns." },
  ],
  COMMUTER_DRIVER: [
    { id: "commuter-charge", section: "DO_FIRST", label: "Charge phone and power bank.", detail: "Keep navigation and emergency communication available." },
    { id: "commuter-maps", section: "DO_FIRST", label: "Download offline maps and routes.", detail: "Save home, work, school, hotel, and destination routes." },
    { id: "commuter-destination", section: "BEFORE", label: "Save destination details and important contacts.", detail: "Keep pickup points, addresses, and phone numbers offline." },
    { id: "commuter-payment", section: "BEFORE", label: "Keep alternate payment options available.", detail: "Bring cash or backup payment in case digital options are affected." },
    { id: "commuter-time", section: "DURING", label: "Allow extra travel time around affected areas.", detail: "Traffic lights, building access, or transport services may be slower." },
    { id: "commuter-zone", section: "DURING", label: "Check whether your destination is in a verified affected area.", detail: "Use the map and calendar before rerouting." },
    { id: "commuter-update", section: "AFTER", label: "Confirm route and destination updates before the return trip.", detail: "Recheck messages once signal and power are stable." },
  ],
  CUSTOM: [
    { id: "custom-priority", section: "DO_FIRST", label: "Write down the most important thing you need to protect or continue.", detail: "Examples: event coverage, small shop operations, family travel, study deadline, or equipment care." },
    { id: "custom-charge", section: "DO_FIRST", label: "Charge the devices that support that priority.", detail: "Start with communication, files, lights, and power banks." },
    { id: "custom-offline", section: "BEFORE", label: "Save key information offline.", detail: "Download files, addresses, contacts, schedules, and screenshots." },
    { id: "custom-backup", section: "BEFORE", label: "Prepare one realistic backup plan.", detail: "Choose backup internet, transport, location, cash, manual records, or support contact." },
    { id: "custom-communicate", section: "DURING", label: "Send status updates before battery gets low.", detail: "Keep messages short and factual." },
    { id: "custom-recover", section: "AFTER", label: "Sync, confirm, and reset once power returns.", detail: "Check what was missed, uploaded, delayed, or needs follow-up." },
  ],
};
