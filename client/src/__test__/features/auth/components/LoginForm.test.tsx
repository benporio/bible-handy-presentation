import { render, screen } from '../../../../utils/TestUtil'
import '@testing-library/jest-dom'
import { LoginForm } from '../../../../features/auth/components/LoginForm/LoginForm';
import { useState } from 'react';
import axios from 'axios';

describe('LoginForm', () => {
    test('should load the login page', async () => {
        render(<LoginForm />)
        expect(screen.getByRole('button', { name: /SIGN IN/i})).toBeInTheDocument()
    })
});