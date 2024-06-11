import { render, screen } from '../../utils/TestUtil'
import '@testing-library/jest-dom'
import App from "../../containers/App";

describe('App', () => {
    test('should load the login page', async () => {
        render(<App />)
        const loginButton = screen.getByRole('button', { name: /SIGN IN/i})
        expect(loginButton).toBeInTheDocument()
        expect(loginButton).toBeDisabled()
    })
});