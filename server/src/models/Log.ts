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

const savePreCallback = (iLog: ILog, next: CallbackWithoutResultAndOptionalError) => {
    if (iLog.isNew) {
        iLog.logDateCreated = new Date();
    } else {
        iLog.logDateUpdated = new Date();
    }
    next()
}

logSchema.pre<ILog>('save', function(next: CallbackWithoutResultAndOptionalError) {
    savePreCallback(this, next);
});

logSchema.pre<ILog>('updateOne', function(next: CallbackWithoutResultAndOptionalError) {
    savePreCallback(this, next);
});

logSchema.pre<ILog>('updateMany', function(next: CallbackWithoutResultAndOptionalError) {
    savePreCallback(this, next);
});

logSchema.pre<ILog>('findOneAndUpdate', function(next: CallbackWithoutResultAndOptionalError) {
    savePreCallback(this, next);
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

const Log = model<ILog, LogModel>('Log', logSchema);

export class LogFactory extends Log {
    private constructor() {
        super();
    }
    public static createLog(): HydratedLogDoc {
        return new Log({
            logDateCreated: null,
            logCreatedByUserId: '',
            logDateUpdated: null,
            logUpdatedByUserId: '',
            logDateDeleted: null,
            logDeletedByUserId: '',
        });
    }
}