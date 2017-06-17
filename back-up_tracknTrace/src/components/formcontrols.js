import React, {Component} from 'react';
import {Field, formValueSelector} from 'redux-form';
import {
  SelectField,
  TextField,
} from 'redux-form-material-ui';

import DatePicker from 'material-ui/DatePicker'
import MenuItem from 'material-ui/MenuItem';



const renderDatePicker = ({ input, defaultValue, label, disabled, meta: { touched, error } }) => (
    <DatePicker 
        errorText = {touched && error} 
        {...input}
        floatingLabelText={label}
        hintText={label}
        onChange = {(event, value) => {input.onChange(value)}} 
        disabled = {disabled} />
)

export const renderFormControl = (fieldConfig, key, collection, val, onChangeFunc) =>
{
    //console.log('inside renderFormControl');
    switch(fieldConfig.type)
    {
        case 'select':

            return(
                <Field
                        name={key}
                        component={SelectField}
                        hintText={fieldConfig.label}
                        floatingLabelText={fieldConfig.label}
                        disabled={fieldConfig.disabled} 
                        value={val}
                       onChange={(event, index, value) => onChangeFunc(index)}                          
                    >
                        {(collection.length > 0) ? fieldConfig.populatechild(collection) : ''}
                    </Field>
            );
        case 'input':
            return(
                <Field
                            name={key}
                            component={TextField}
                            hintText={fieldConfig.label}
                            floatingLabelText={fieldConfig.label}
                            disabled={fieldConfig.disabled} 
                            onChange={(event, value) => onChangeFunc(value)}
                            // defaultValue={val}
                        />
            );     
        case 'date' :
            return(
                        <Field
                        name={key}
                        component={renderDatePicker}
                        format={null}
                        label={fieldConfig.label}
                        hintText={fieldConfig.label}
                        //value={val}
                        //defaultValue={val}
                        disabled={fieldConfig.disabled} 
                        onChange={(event, value) => onChangeFunc(value)}
                    />
            );
        default:
            return <div></div>
    }
    
}
