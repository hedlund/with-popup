import React, { Component, Fragment } from 'react';

export default config => {
  const render = {};
  Object.keys(config).forEach(key => {
    render[key] = typeof config[key] === 'function' ? config[key] : config[key].render;
  });

  return WrappedComponent =>
    class extends Component {
      constructor(props) {
        super(props);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);

        this.popups = {};
        this.state = {};
        Object.keys(config).forEach(key => {
          this.state[key] = {
            isShowing: false,
            initialProps: null,
          };
          this.popups[key] = initialProps => () => this.show(key, initialProps);
        });
      }

      show(key, initialProps = null) {
        this.setState({
          [key]: {
            isShowing: true,
            initialProps,
          },
        });
      }

      hide(key, ...args) {
        this.setState({
          [key]: {
            isShowing: false,
          },
        });
        if (config[key].onClose) {
          config[key].onClose(this.state[key].initialProps, ...args);
        }
      }

      render() {
        const { popup = {}, ...props } = this.props;
        return (
          <Fragment>
            <WrappedComponent {...props} popup={this.popups} />

            {Object.keys(this.state).map(key => {
              const state = this.state[key];
              return (
                state.isShowing &&
                render[key]({
                  key,
                  ...this.state[key].initialProps,
                  ...popup[key],
                  handleClose: (...args) => this.hide(key, ...args),
                })
              );
            })}
          </Fragment>
        );
      }
    };
};
