import { model, Schema, Model, Document, HydratedDocument, CallbackWithoutResultAndOptionalError } from 'mongoose';

export interface ILog extends Document {
    logDateCreated: Date
    logCreatedByUserId: string
    logDateUpdated: Date
    logUpdatedByUserId: string
    logDateDeleted: Date
    logDeletedByUserId: string
}

type LogModel = Model<ILog>

export const logSchema: Schema<ILog, LogModel> = new Schema({
    logDateCreated: { type: Date },
    logCreatedByUserId: { type: String },
    logDateUpdated: { type: Date },
    logUpdatedByUserId: { type: String },
    logDateDeleted: { type: Date },
    logDeletedByUserId: { type: String },
}, {
    methods: {
        
    },
    virtuals: {
        
    }
});

logSchema.pre<ILog>('save', function(next: CallbackWithoutResultAndOptionalError) {
    if (this.isNew) {
        this.logDateCreated = new Date();
    } else {
        this.logDateUpdated = new Date();
    }
    next()
});

const deletePreCallback = (iLog: ILog, next: CallbackWithoutResultAndOptionalError) => {
    iLog.logDateDeleted = new Date();
    next()
}

logSchema.pre<ILog>('deleteOne', function(next: CallbackWithoutResultAndOptionalError) {
    deletePreCallback(this, next);
});
logSchema.pre<ILog>('deleteMany', function(next: CallbackWithoutResultAndOptionalError) {
    deletePreCallback(this, next);
});
logSchema.pre<ILog>('findOneAndDelete', function(next: CallbackWithoutResultAndOptionalError) {
    deletePreCallback(this, next);
});


export type HydratedLogDoc = HydratedDocument<ILog>

export default model<ILog, LogModel>('Log', logSchema);