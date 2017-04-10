from django import forms


class RangeInput(forms.TextInput):
    input_type = 'range'
