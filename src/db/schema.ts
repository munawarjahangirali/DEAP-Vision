import { pgTable, pgEnum, integer, varchar, boolean, text, timestamp, doublePrecision, jsonb, serial } from "drizzle-orm/pg-core";

// Custom Enumerations
const severityEnum = pgEnum("severityenum", ["MODERATE", "CRITICAL", "MINOR", "CATASTROPHIC", "HAZARDOUS"]);
const statusEnum = pgEnum("statusenum", ["PENDING", "CLOSED"]);
const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN", "SUPERADMIN"]);

// Tables
export const categories = pgTable("categories", {
  id: integer("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  enabled: boolean("enabled"),
  color: varchar("color"),
  createdBy: integer("createdBy"),
  updatedBy: integer("updatedBy"),
});

export const failedRequests = pgTable("failed_requests", {
  id: integer("id").primaryKey().notNull(),
  method: varchar("method", { length: 10 }),
  url: varchar("url", { length: 200 }),
  statusCode: integer("status_code"),
  body: text("body"),
});

export const masterData = pgTable("masterdata", {
  id: integer("id").primaryKey().notNull(),
  addition: varchar("addition"),
  eventId: varchar("event_id"),
  boardId: varchar("board_id"),
  dataId: integer("data_id"),
  gbDeviceId: varchar("gb_device_id"),
  gbTaskChnId: varchar("gb_task_chn_id"),
  gpsAngleCourse: doublePrecision("gps_angle_course"),
  gpsAvailable: boolean("gps_available"),
  gpsKSpeed: doublePrecision("gps_k_speed"),
  gpsLatitude: doublePrecision("gps_latitude"),
  gpsLatitudeType: varchar("gps_latitude_type"),
  gpsLongitude: doublePrecision("gps_longitude"),
  gpsLongitudeType: varchar("gps_longitude_type"),
  gpsNSpeed: doublePrecision("gps_n_speed"),
  gpsUtc: varchar("gps_utc"),
  camsnap: varchar("camsnap"),
  localLabelPath: varchar("local_label_path"),
  localRawPath: varchar("local_raw_path"),
  mediaGbTransport: boolean("media_gb_transport"),
  mediaDescription: varchar("media_description"),
  mediaHeight: integer("media_height"),
  mediaName: varchar("media_name"),
  mediaUrl: varchar("media_url"),
  mediaWidth: integer("media_width"),
  mediaParams: varchar("media_params"),
  mediaRtspTransport: boolean("media_rtsp_transport"),
  result: jsonb("result"),
  summary: varchar("summary"),
  taskDesc: text("task_desc"),
  taskSession: varchar("task_session"),
  time: varchar("time"),
  timeStamp: timestamp("time_stamp"),
  alarmType: varchar("alarm_type"),
  type: integer("type"),
  uniqueId: varchar("unique_id"),
  videoFile: text("video_file"),
  status: boolean("status"),
  region: jsonb("region"),
  properties: jsonb("properties"),
  assistantRegions: jsonb("assistant_regions"),
  relativeBox: jsonb("relative_box"),
  regType: varchar("reg_type"),
  cropped: boolean("cropped"),
  description: varchar("description"),
  createdDate: timestamp("created_date").defaultNow(),
  updatedDate: timestamp("updated_date"),
  updatedBy: integer("updated_by"),
  imageFile: text("image_file"),
  checksum: varchar("checksum", { length: 255 }),
  boardIp: varchar("board_ip"),
});

export const sites = pgTable("sites", {
  id: integer("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  longitude: varchar("longitude"),
  latitude: varchar("latitude"),
  rpm:  doublePrecision("rpm"),
  stand_pipe_pressure: doublePrecision("stand_pipe_pressure"),
  boardID: varchar("board_id"),
  liveView: varchar("live_view"),
  enabled: boolean("enabled"),
  createdBy: integer("createdBy"),
  updatedBy: integer("updatedBy"),
});

export const clients = pgTable("clients", {
  id: integer("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  enabled: boolean("enabled"),
  createdBy: integer("createdBy"),
  updatedBy: integer("updatedBy"),
});

export const users = pgTable("user", {
  id: integer("id").primaryKey().notNull(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  hashedPassword: varchar("hashed_password").notNull(),
  role: userRoleEnum("role").notNull().default("USER"),
  clientId: integer('client_id').references(() => clients.id).notNull(),
});

export const userTokens = pgTable('user_tokens', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id).notNull(),
  token: text('token').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export const zones = pgTable("zones", {
  id: integer("id").primaryKey().notNull(),
  name: varchar("name").notNull(),
  enabled: boolean("enabled"),
  createdBy: integer("createdBy"),
  updatedBy: integer("updatedBy"),
});

export const settings = pgTable("settings", {
  id: serial('id').primaryKey(),
  priority: integer("priority"),
  objectObservation: varchar("object_observation"),
  camera: varchar("camera"),
  primaryCategory: varchar("primary_category"),
  zone: varchar("zone"),
  secondaryCategory: varchar("secondary_category"),
  timeFrom: varchar("time_from"),
  timeUntil: varchar("time_until"),
  eventThreshold: integer("event_thresold"),
  solution: varchar("solution"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
});


export const violations = pgTable("violations", {
  id: serial('id').primaryKey(),
  masterDataId: integer("master_data_id").references(() => masterData.id),
  categoryId: integer("category_id").references(() => categories.id),
  addition: varchar("addition"),
  eventId: varchar("event_id"),
  boardId: varchar("board_id").references(() => sites.boardID),
  dataId: integer("data_id"),
  gbDeviceId: varchar("gb_device_id"),
  gbTaskChnId: varchar("gb_task_chn_id"),
  gpsAngleCourse: doublePrecision("gps_angle_course"),
  gpsAvailable: boolean("gps_available"),
  gpsKSpeed: doublePrecision("gps_k_speed"),
  gpsLatitude: doublePrecision("gps_latitude"),
  gpsLatitudeType: varchar("gps_latitude_type"),
  gpsLongitude: doublePrecision("gps_longitude"),
  gpsLongitudeType: varchar("gps_longitude_type"),
  gpsNSpeed: doublePrecision("gps_n_speed"),
  gpsUtc: varchar("gps_utc"),
  camsnap: varchar("camsnap"),
  localLabelPath: varchar("local_label_path"),
  localRawPath: varchar("local_raw_path"),
  mediaGbTransport: boolean("media_gb_transport"),
  mediaDescription: varchar("media_description"),
  mediaHeight: integer("media_height"),
  mediaName: varchar("media_name"),
  mediaUrl: varchar("media_url"),
  mediaWidth: integer("media_width"),
  mediaParams: varchar("media_params"),
  mediaRtspTransport: boolean("media_rtsp_transport"),
  result: jsonb("result"),
  summary: varchar("summary"),
  taskDesc: text("task_desc"),
  taskSession: varchar("task_session"),
  time: varchar("time"),
  timeStamp: timestamp("time_stamp"),
  alarmType: varchar("alarm_type"),
  type: integer("type"),
  uniqueId: varchar("unique_id"),
  videoFile: text("video_file"),
  status: boolean("status"),
  region: jsonb("region"),
  properties: jsonb("properties"),
  assistantRegions: jsonb("assistant_regions"),
  relativeBox: jsonb("relative_box"),
  regType: varchar("reg_type"),
  cropped: boolean("cropped"),
  description: varchar("description"),
  createdDate: timestamp("created_date").defaultNow(),
  updatedDate: timestamp("updated_date"),
  updatedBy: integer("updated_by"),
  imageFile: text("image_file"),
  checksum: varchar("checksum", { length: 255 }),
  boardIp: varchar("board_ip"),
  violationStatus: statusEnum("violation_status"),
  siteId: integer("site_id").references(() => sites.id),
  zoneId: integer("zone_id").references(() => zones.id),
  comment: text("comment"),
  file: text("file"),
  assignedTo: varchar("assigned_to"),
  violationType: varchar("violation_type"),
  activity: varchar("activity"),
  severity: severityEnum("severity"),
  reviewedAt: timestamp("reviewed_at"),
});

export const histories = pgTable('histories', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 255 }),
  typeId: integer('typeid'),
  data: text('data').$type<string>(),
  createdBy: integer('created_by'),
  updatedBy: integer('updated_by'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activityHazardControls = pgTable("activity_hazard_controls", {
  id: serial("id").primaryKey(),
  activityName: text("activity_name").notNull(),
  hazardDescription: text("hazard_description").notNull(),
  controlMeasure: text("control_measure").notNull(),
});

export const chatHistory = pgTable("chat_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  query: text("query").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});