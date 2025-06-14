function Input({ ref, img, type, identifier, placeholder, autofocus, value, handleChange }) {
  return (
    <p className="flex flex-row">
      <label htmlFor={identifier}>
        <img src={img.src} alt={img.alt} />
      </label>

      <input
        required
        ref={ref ? ref : null}
        onChange={handleChange ? handleChange : null}
        id={identifier}
        name={identifier}
        defaultValue={value ? value : ''}
        autoFocus={autofocus}
        type={type}
        placeholder={placeholder} />
    </p>
  )
}

export default Input